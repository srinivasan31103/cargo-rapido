import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { updateDriverLocation } from './utils/driverMatcher.js';
import Booking from './models/Booking.js';
import Driver from './models/Driver.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Driver-specific events
    if (socket.userRole === 'driver') {
      handleDriverEvents(socket);
    }

    // User-specific events
    if (socket.userRole === 'user' || socket.userRole === 'business') {
      handleUserEvents(socket);
    }

    // Common events
    handleCommonEvents(socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const handleDriverEvents = (socket) => {
  // Driver sends location updates
  socket.on('driver:updateLocation', async (data) => {
    try {
      const { lat, lng, heading, speed, accuracy } = data;

      await updateDriverLocation(socket.userId, {
        lat,
        lng,
        heading,
        speed,
        accuracy
      });

      // Find active bookings for this driver
      const activeBookings = await Booking.find({
        driver: socket.userId,
        status: { $in: ['driver_assigned', 'picked_up', 'in_transit', 'reached_destination'] }
      });

      // Broadcast location to users tracking these bookings
      activeBookings.forEach(booking => {
        io.to(`booking:${booking._id}`).emit('driver:locationUpdate', {
          bookingId: booking._id,
          location: { lat, lng },
          heading,
          speed
        });
      });

      socket.emit('driver:locationUpdateSuccess', { success: true });
    } catch (error) {
      socket.emit('driver:locationUpdateError', { error: error.message });
    }
  });

  // Driver accepts booking
  socket.on('driver:acceptBooking', async (data) => {
    try {
      const { bookingId } = data;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return socket.emit('error', { message: 'Booking not found' });
      }

      if (booking.status !== 'pending') {
        return socket.emit('error', { message: 'Booking already assigned' });
      }

      booking.driver = socket.userId;
      booking.status = 'driver_assigned';
      booking.timeline.push({
        status: 'driver_assigned',
        timestamp: new Date()
      });
      await booking.save();

      // Notify user
      io.to(`user:${booking.user}`).emit('booking:driverAssigned', {
        bookingId: booking._id,
        driver: socket.userId
      });

      socket.emit('driver:bookingAccepted', { bookingId, success: true });
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });

  // Driver rejects booking
  socket.on('driver:rejectBooking', async (data) => {
    try {
      const { bookingId, reason } = data;
      socket.emit('driver:bookingRejected', { bookingId, success: true });

      // Try to find another driver (implement auto-reassignment logic if needed)
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });

  // Driver status updates
  socket.on('driver:statusChange', async (data) => {
    try {
      const { status } = data;
      await Driver.findByIdAndUpdate(socket.userId, { status });
      socket.emit('driver:statusChanged', { status, success: true });
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });
};

const handleUserEvents = (socket) => {
  // User tracks booking
  socket.on('booking:track', async (data) => {
    try {
      const { bookingId } = data;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return socket.emit('error', { message: 'Booking not found' });
      }

      // Verify user owns this booking
      if (booking.user.toString() !== socket.userId) {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      // Join booking room to receive real-time updates
      socket.join(`booking:${bookingId}`);

      // Send current booking status
      socket.emit('booking:currentStatus', {
        bookingId,
        status: booking.status,
        timeline: booking.timeline
      });

      // If driver assigned, send driver location
      if (booking.driver) {
        const driver = await Driver.findById(booking.driver).select('currentLocation name phone rating');
        socket.emit('driver:currentLocation', {
          bookingId,
          driver: {
            id: driver._id,
            name: driver.name,
            phone: driver.phone,
            rating: driver.rating,
            location: driver.currentLocation
          }
        });
      }
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });

  // User stops tracking
  socket.on('booking:stopTracking', (data) => {
    const { bookingId } = data;
    socket.leave(`booking:${bookingId}`);
  });

  // User cancels booking
  socket.on('booking:cancel', async (data) => {
    try {
      const { bookingId, reason } = data;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return socket.emit('error', { message: 'Booking not found' });
      }

      if (booking.user.toString() !== socket.userId) {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      booking.status = 'cancelled';
      booking.cancellation = {
        cancelledBy: 'user',
        reason,
        cancelledAt: new Date()
      };
      await booking.save();

      // Notify driver if assigned
      if (booking.driver) {
        io.to(`user:${booking.driver}`).emit('booking:cancelledByUser', {
          bookingId,
          reason
        });
      }

      socket.emit('booking:cancelled', { bookingId, success: true });
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });
};

const handleCommonEvents = (socket) => {
  // Chat messages (if implementing chat feature)
  socket.on('message:send', async (data) => {
    try {
      const { bookingId, message } = data;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return socket.emit('error', { message: 'Booking not found' });
      }

      // Broadcast to all parties in the booking
      io.to(`booking:${bookingId}`).emit('message:received', {
        bookingId,
        from: socket.userId,
        message,
        timestamp: new Date()
      });
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });

  // Ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });
};

// Utility function to emit events from outside socket.io
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToBooking = (bookingId, event, data) => {
  if (io) {
    io.to(`booking:${bookingId}`).emit(event, data);
  }
};

export const broadcastToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

export const getIO = () => io;
