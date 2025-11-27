import mongoose from 'mongoose';

const deliveryRecordSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupProof: {
    timestamp: Date,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    },
    photo: String,
    otp: String,
    otpVerified: {
      type: Boolean,
      default: false
    }
  },
  deliveryProof: {
    timestamp: Date,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    },
    photo: String,
    signature: String,
    otp: String,
    otpVerified: {
      type: Boolean,
      default: false
    },
    recipientName: String,
    recipientPhone: String
  },
  notes: String,
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

deliveryRecordSchema.index({ booking: 1 });

const DeliveryRecord = mongoose.model('DeliveryRecord', deliveryRecordSchema);

export default DeliveryRecord;
