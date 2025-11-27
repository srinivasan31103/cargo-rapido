import Driver from '../models/Driver.js';
import DriverLocation from '../models/DriverLocation.js';

export const findNearestDrivers = async (location, radius = 10, limit = 10) => {
  try {
    const { lng, lat } = location;

    // Find drivers within radius
    const nearbyDriverLocations = await DriverLocation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).limit(limit);

    if (nearbyDriverLocations.length === 0) {
      return [];
    }

    const driverIds = nearbyDriverLocations.map(loc => loc.driver);

    // Get driver details with vehicle info
    const drivers = await Driver.find({
      _id: { $in: driverIds },
      status: 'online',
      kycStatus: 'approved',
      isActive: true,
      isBlocked: false
    })
      .populate('vehicle')
      .select('-password');

    // Calculate distance for each driver
    const driversWithDistance = drivers.map(driver => {
      const driverLocation = nearbyDriverLocations.find(
        loc => loc.driver.toString() === driver._id.toString()
      );

      const distance = calculateDistance(
        lat,
        lng,
        driverLocation.location.coordinates[1],
        driverLocation.location.coordinates[0]
      );

      return {
        ...driver.toObject(),
        distance: parseFloat(distance.toFixed(2)),
        currentLocation: {
          lat: driverLocation.location.coordinates[1],
          lng: driverLocation.location.coordinates[0]
        }
      };
    });

    // Sort by distance
    driversWithDistance.sort((a, b) => a.distance - b.distance);

    return driversWithDistance;
  } catch (error) {
    console.error('Error finding nearest drivers:', error);
    throw error;
  }
};

export const matchDriverToBooking = async (booking) => {
  try {
    const { pickup, cargoDetails } = booking;

    // Find drivers within search radius
    const radius = parseFloat(process.env.DRIVER_SEARCH_RADIUS) || 10;
    const nearbyDrivers = await findNearestDrivers(
      {
        lat: pickup.coordinates.coordinates[1],
        lng: pickup.coordinates.coordinates[0]
      },
      radius
    );

    if (nearbyDrivers.length === 0) {
      return null;
    }

    // Filter by cargo size capability
    const suitableDrivers = nearbyDrivers.filter(driver => {
      if (!driver.vehicle || !driver.vehicle.cargoSizes) return false;
      return driver.vehicle.cargoSizes.includes(cargoDetails.size);
    });

    if (suitableDrivers.length === 0) {
      return nearbyDrivers[0]; // Return nearest even if cargo size doesn't match
    }

    // Sort by rating and distance
    const rankedDrivers = suitableDrivers.map(driver => {
      const ratingScore = driver.rating.average * 20; // 0-100
      const distanceScore = Math.max(0, 100 - (driver.distance * 10)); // Closer is better
      const experienceScore = Math.min(100, driver.stats.completedDeliveries); // More deliveries is better

      const totalScore = (ratingScore * 0.4) + (distanceScore * 0.4) + (experienceScore * 0.2);

      return {
        ...driver,
        matchScore: totalScore
      };
    });

    rankedDrivers.sort((a, b) => b.matchScore - a.matchScore);

    return rankedDrivers[0];
  } catch (error) {
    console.error('Error matching driver:', error);
    throw error;
  }
};

export const updateDriverLocation = async (driverId, locationData) => {
  try {
    const { lat, lng, heading, speed, accuracy } = locationData;

    const location = await DriverLocation.findOneAndUpdate(
      { driver: driverId },
      {
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        heading,
        speed,
        accuracy,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Also update driver's current location
    await Driver.findByIdAndUpdate(driverId, {
      currentLocation: {
        type: 'Point',
        coordinates: [lng, lat],
        updatedAt: new Date()
      }
    });

    return location;
  } catch (error) {
    console.error('Error updating driver location:', error);
    throw error;
  }
};

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
