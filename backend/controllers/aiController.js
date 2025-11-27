import {
  aiPricingAdjuster,
  aiCargoClassifier,
  aiRouteAdvisor,
  aiBusinessInsights
} from '../utils/aiService.js';
import Booking from '../models/Booking.js';
import Driver from '../models/Driver.js';

export const getPricingSuggestion = async (req, res) => {
  try {
    const { distance, cargoSize, weather } = req.body;

    // Get current system metrics
    const currentDrivers = await Driver.countDocuments({
      status: 'online',
      kycStatus: 'approved'
    });

    const activeBookings = await Booking.countDocuments({
      status: { $in: ['pending', 'driver_assigned', 'picked_up', 'in_transit'] }
    });

    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' :
                      currentHour < 17 ? 'afternoon' :
                      currentHour < 21 ? 'evening' : 'night';

    const pricingData = await aiPricingAdjuster({
      distance,
      cargoSize,
      currentDrivers,
      activeBookings,
      timeOfDay,
      weather: weather || 'normal'
    });

    res.json({
      success: true,
      data: pricingData
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'AI pricing service error'
    });
  }
};

export const classifyCargo = async (req, res) => {
  try {
    const { description, photoUrl } = req.body;

    if (!description && !photoUrl) {
      return res.status(400).json({
        message: 'Either description or photo is required'
      });
    }

    const classification = await aiCargoClassifier({
      description,
      photoUrl
    });

    res.json({
      success: true,
      data: classification
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'AI cargo classification service error'
    });
  }
};

export const getRouteAdvice = async (req, res) => {
  try {
    const { pickup, drop, currentTraffic, weather } = req.body;

    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' :
                      currentHour < 17 ? 'afternoon' :
                      currentHour < 21 ? 'evening' : 'night';

    const routeAdvice = await aiRouteAdvisor({
      pickup,
      drop,
      currentTraffic: currentTraffic || 'moderate',
      timeOfDay,
      weather: weather || 'clear'
    });

    res.json({
      success: true,
      data: routeAdvice
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'AI route advisory service error'
    });
  }
};

export const getBusinessInsights = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user._id;

    // Calculate date range (default: last 7 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get user bookings in range
    const bookings = await Booking.find({
      user: userId,
      createdAt: { $gte: start, $lte: end }
    });

    const totalDeliveries = bookings.length;
    const completedDeliveries = bookings.filter(b => b.status === 'completed').length;
    const cancelledDeliveries = bookings.filter(b => b.status === 'cancelled').length;

    const totalRevenue = bookings
      .filter(b => b.payment.status === 'completed')
      .reduce((sum, b) => sum + b.pricing.total, 0);

    const averageRevenue = totalDeliveries > 0 ? totalRevenue / totalDeliveries : 0;

    // Calculate top routes
    const routeMap = {};
    bookings.forEach(b => {
      const route = `${b.pickup.address} → ${b.drop.address}`;
      routeMap[route] = (routeMap[route] || 0) + 1;
    });

    const topRoutes = Object.entries(routeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }));

    // Get driver stats for completed bookings
    const completedBookingsWithDriver = bookings.filter(b =>
      b.status === 'completed' && b.driver
    );

    const driverStats = {
      totalDrivers: new Set(completedBookingsWithDriver.map(b => b.driver.toString())).size,
      averageRating: completedBookingsWithDriver.length > 0
        ? completedBookingsWithDriver.reduce((sum, b) => sum + (b.rating?.byUser?.stars || 0), 0) / completedBookingsWithDriver.length
        : 0
    };

    const period = `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;

    const insights = await aiBusinessInsights({
      deliveries: {
        total: totalDeliveries,
        completed: completedDeliveries,
        cancelled: cancelledDeliveries
      },
      revenue: {
        total: totalRevenue,
        average: averageRevenue
      },
      period,
      topRoutes,
      driverStats
    });

    res.json({
      success: true,
      data: {
        ...insights,
        rawData: {
          totalDeliveries,
          completedDeliveries,
          cancelledDeliveries,
          totalRevenue,
          averageRevenue,
          topRoutes,
          driverStats
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'AI business insights service error'
    });
  }
};
