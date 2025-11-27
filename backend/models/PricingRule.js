import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'scooter', 'auto', 'mini-truck', 'truck', 'all'],
    default: 'all'
  },
  cargoSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'all'],
    default: 'all'
  },
  baseFare: {
    type: Number,
    required: true,
    default: 50
  },
  perKmRate: {
    type: Number,
    required: true,
    default: 12
  },
  cargoSizeMultipliers: {
    XS: { type: Number, default: 1 },
    S: { type: Number, default: 1.2 },
    M: { type: Number, default: 1.5 },
    L: { type: Number, default: 2 },
    XL: { type: Number, default: 2.5 }
  },
  surgeRules: {
    peakHours: [{
      start: String,
      end: String,
      multiplier: Number
    }],
    lowDriverAvailability: {
      threshold: Number,
      multiplier: Number
    },
    highDemand: {
      threshold: Number,
      multiplier: Number
    },
    weatherConditions: {
      rain: { type: Number, default: 1.3 },
      storm: { type: Number, default: 1.5 }
    }
  },
  addOns: {
    express: {
      enabled: { type: Boolean, default: true },
      charge: { type: Number, default: 50 }
    },
    insurance: {
      enabled: { type: Boolean, default: true },
      percentageOfTotal: { type: Number, default: 5 }
    },
    fragile: {
      enabled: { type: Boolean, default: true },
      charge: { type: Number, default: 30 }
    }
  },
  minimumFare: {
    type: Number,
    default: 50
  },
  maximumFare: Number,
  city: String,
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: Date,
  validUntil: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

pricingRuleSchema.index({ vehicleType: 1, cargoSize: 1, isActive: 1 });

const PricingRule = mongoose.model('PricingRule', pricingRuleSchema);

export default PricingRule;
