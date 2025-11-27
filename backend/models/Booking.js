import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  pickup: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    contactName: String,
    contactPhone: String,
    instructions: String
  },
  drop: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    contactName: String,
    contactPhone: String,
    instructions: String
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    estimated: Number,
    actual: Number
  },
  cargoDetails: {
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL'],
      required: true
    },
    weight: Number,
    description: String,
    fragile: {
      type: Boolean,
      default: false
    },
    photo: String
  },
  pricing: {
    baseFare: {
      type: Number,
      required: true
    },
    distanceFare: {
      type: Number,
      required: true
    },
    cargoSizeMultiplier: {
      type: Number,
      default: 1
    },
    surgeMultiplier: {
      type: Number,
      default: 1
    },
    addOns: {
      express: {
        enabled: Boolean,
        charge: Number
      },
      insurance: {
        enabled: Boolean,
        charge: Number
      },
      fragile: {
        enabled: Boolean,
        charge: Number
      }
    },
    discount: {
      type: Number,
      default: 0
    },
    promoCode: String,
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'driver_assigned',
      'driver_arrived',
      'picked_up',
      'in_transit',
      'reached_destination',
      'delivered',
      'completed',
      'cancelled',
      'failed'
    ],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    },
    note: String
  }],
  otp: {
    pickup: String,
    drop: String
  },
  pod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryRecord'
  },
  payment: {
    method: {
      type: String,
      enum: ['wallet', 'card', 'upi', 'cash'],
      default: 'wallet'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  scheduledFor: Date,
  recurring: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    nextScheduled: Date,
    parentBookingId: String
  },
  rating: {
    byUser: {
      stars: Number,
      comment: String
    },
    byDriver: {
      stars: Number,
      comment: String
    }
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['user', 'driver', 'admin', 'system']
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ 'pickup.coordinates': '2dsphere' });
bookingSchema.index({ 'drop.coordinates': '2dsphere' });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ driver: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.bookingId = `CR${timestamp}${random}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
