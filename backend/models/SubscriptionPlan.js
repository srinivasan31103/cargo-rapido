import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  type: {
    type: String,
    enum: ['business', 'premium'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  durationType: {
    type: String,
    enum: ['days', 'months', 'years'],
    default: 'months'
  },
  price: {
    type: Number,
    required: true
  },
  features: {
    freeDeliveries: {
      type: Number,
      default: 0
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    bulkScheduling: {
      type: Boolean,
      default: false
    },
    recurringDeliveries: {
      type: Boolean,
      default: false
    },
    dedicatedManager: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

export default SubscriptionPlan;
