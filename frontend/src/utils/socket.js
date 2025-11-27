import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Driver location tracking
export const emitDriverLocation = (locationData) => {
  if (socket) {
    socket.emit('driver:updateLocation', locationData);
  }
};

// Booking tracking
export const trackBooking = (bookingId) => {
  if (socket) {
    socket.emit('booking:track', { bookingId });
  }
};

export const stopTrackingBooking = (bookingId) => {
  if (socket) {
    socket.emit('booking:stopTracking', { bookingId });
  }
};

// Driver booking actions
export const acceptBooking = (bookingId) => {
  if (socket) {
    socket.emit('driver:acceptBooking', { bookingId });
  }
};

export const rejectBooking = (bookingId, reason) => {
  if (socket) {
    socket.emit('driver:rejectBooking', { bookingId, reason });
  }
};

// Listen to events
export const onDriverLocationUpdate = (callback) => {
  if (socket) {
    socket.on('driver:locationUpdate', callback);
  }
};

export const onBookingStatusUpdate = (callback) => {
  if (socket) {
    socket.on('booking:statusUpdate', callback);
  }
};

export const onDriverAssigned = (callback) => {
  if (socket) {
    socket.on('booking:driverAssigned', callback);
  }
};

export const offEvent = (eventName) => {
  if (socket) {
    socket.off(eventName);
  }
};
