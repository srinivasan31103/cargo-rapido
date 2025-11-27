import PricingRule from '../models/PricingRule.js';
import Driver from '../models/Driver.js';
import Booking from '../models/Booking.js';

export const calculatePrice = async (data) => {
  const { distance, cargoSize, vehicleType, addOns = {}, promoCode } = data;

  // Get pricing rule (default if not found)
  let pricingRule = await PricingRule.findOne({
    isActive: true,
    vehicleType: { $in: [vehicleType, 'all'] }
  });

  if (!pricingRule) {
    pricingRule = await createDefaultPricingRule();
  }

  // Base calculations
  const baseFare = pricingRule.baseFare;
  const distanceFare = distance * pricingRule.perKmRate;
  const cargoMultiplier = pricingRule.cargoSizeMultipliers[cargoSize] || 1;

  // Calculate surge multiplier
  const surgeMultiplier = await calculateSurgeMultiplier(pricingRule);

  // Calculate add-ons
  let addOnCharges = 0;
  const addOnDetails = {};

  if (addOns.express && pricingRule.addOns.express.enabled) {
    addOnCharges += pricingRule.addOns.express.charge;
    addOnDetails.express = {
      enabled: true,
      charge: pricingRule.addOns.express.charge
    };
  }

  if (addOns.fragile && pricingRule.addOns.fragile.enabled) {
    addOnCharges += pricingRule.addOns.fragile.charge;
    addOnDetails.fragile = {
      enabled: true,
      charge: pricingRule.addOns.fragile.charge
    };
  }

  // Calculate subtotal
  let subtotal = (baseFare + distanceFare) * cargoMultiplier * surgeMultiplier + addOnCharges;

  // Insurance (percentage of subtotal)
  if (addOns.insurance && pricingRule.addOns.insurance.enabled) {
    const insuranceCharge = (subtotal * pricingRule.addOns.insurance.percentageOfTotal) / 100;
    addOnCharges += insuranceCharge;
    addOnDetails.insurance = {
      enabled: true,
      charge: insuranceCharge
    };
    subtotal += insuranceCharge;
  }

  // Apply minimum fare
  if (subtotal < pricingRule.minimumFare) {
    subtotal = pricingRule.minimumFare;
  }

  // Apply promo code discount
  let discount = 0;
  if (promoCode) {
    discount = await calculatePromoDiscount(promoCode, subtotal);
  }

  const total = Math.round(subtotal - discount);

  return {
    baseFare,
    distanceFare,
    cargoSizeMultiplier: cargoMultiplier,
    surgeMultiplier,
    addOns: addOnDetails,
    discount,
    promoCode: promoCode || null,
    total,
    breakdown: {
      base: baseFare,
      distance: distanceFare,
      cargoMultiplier,
      surge: surgeMultiplier,
      addOns: addOnCharges,
      discount
    }
  };
};

const calculateSurgeMultiplier = async (pricingRule) => {
  let multiplier = 1.0;

  // Check peak hours
  const currentHour = new Date().getHours();
  const currentTime = `${currentHour.toString().padStart(2, '0')}:00`;

  if (pricingRule.surgeRules?.peakHours) {
    for (const peak of pricingRule.surgeRules.peakHours) {
      const startHour = parseInt(peak.start.split(':')[0]);
      const endHour = parseInt(peak.end.split(':')[0]);

      if (currentHour >= startHour && currentHour <= endHour) {
        multiplier = Math.max(multiplier, peak.multiplier);
      }
    }
  }

  // Check driver availability
  const onlineDrivers = await Driver.countDocuments({
    status: 'online',
    kycStatus: 'approved',
    isActive: true
  });

  if (pricingRule.surgeRules?.lowDriverAvailability) {
    if (onlineDrivers < pricingRule.surgeRules.lowDriverAvailability.threshold) {
      multiplier = Math.max(multiplier, pricingRule.surgeRules.lowDriverAvailability.multiplier);
    }
  }

  // Check high demand
  const activeBookings = await Booking.countDocuments({
    status: { $in: ['pending', 'driver_assigned', 'picked_up', 'in_transit'] }
  });

  if (pricingRule.surgeRules?.highDemand) {
    if (activeBookings > pricingRule.surgeRules.highDemand.threshold) {
      multiplier = Math.max(multiplier, pricingRule.surgeRules.highDemand.multiplier);
    }
  }

  // Weather conditions (mocked - integrate real weather API)
  const weatherCondition = await getMockedWeather();
  if (weatherCondition === 'rain' && pricingRule.surgeRules?.weatherConditions?.rain) {
    multiplier = Math.max(multiplier, pricingRule.surgeRules.weatherConditions.rain);
  } else if (weatherCondition === 'storm' && pricingRule.surgeRules?.weatherConditions?.storm) {
    multiplier = Math.max(multiplier, pricingRule.surgeRules.weatherConditions.storm);
  }

  return Math.min(multiplier, 2.5); // Cap at 2.5x
};

const getMockedWeather = async () => {
  // Mock weather - in production, integrate OpenWeather or similar API
  const conditions = ['clear', 'clear', 'clear', 'rain', 'clear'];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

const calculatePromoDiscount = async (promoCode, subtotal) => {
  // Promo code logic - implement promo code model if needed
  const promoCodes = {
    'FIRST50': { type: 'flat', value: 50, minOrder: 100 },
    'SAVE20': { type: 'percentage', value: 20, minOrder: 200 },
    'WELCOME100': { type: 'flat', value: 100, minOrder: 300 }
  };

  const promo = promoCodes[promoCode.toUpperCase()];
  if (!promo) return 0;

  if (subtotal < promo.minOrder) return 0;

  if (promo.type === 'flat') {
    return promo.value;
  } else if (promo.type === 'percentage') {
    return (subtotal * promo.value) / 100;
  }

  return 0;
};

const createDefaultPricingRule = async () => {
  const defaultRule = new PricingRule({
    name: 'Default Pricing',
    vehicleType: 'all',
    cargoSize: 'all',
    baseFare: parseFloat(process.env.BASE_FARE) || 50,
    perKmRate: parseFloat(process.env.PER_KM_RATE) || 12,
    cargoSizeMultipliers: {
      XS: 1,
      S: 1.2,
      M: 1.5,
      L: 2,
      XL: 2.5
    },
    surgeRules: {
      peakHours: [
        { start: '08:00', end: '10:00', multiplier: 1.3 },
        { start: '17:00', end: '20:00', multiplier: 1.5 }
      ],
      lowDriverAvailability: {
        threshold: 5,
        multiplier: 1.4
      },
      highDemand: {
        threshold: 20,
        multiplier: 1.5
      },
      weatherConditions: {
        rain: 1.3,
        storm: 1.5
      }
    },
    addOns: {
      express: {
        enabled: true,
        charge: 50
      },
      insurance: {
        enabled: true,
        percentageOfTotal: 5
      },
      fragile: {
        enabled: true,
        charge: 30
      }
    },
    minimumFare: 50,
    isActive: true
  });

  await defaultRule.save();
  return defaultRule;
};

export const estimateFare = async (data) => {
  try {
    const pricing = await calculatePrice(data);
    return {
      success: true,
      pricing
    };
  } catch (error) {
    console.error('Pricing calculation error:', error);
    throw error;
  }
};
