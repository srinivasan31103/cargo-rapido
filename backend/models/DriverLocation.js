import mongoose from 'mongoose';

const driverLocationSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
    unique: true
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  heading: Number,
  speed: Number,
  accuracy: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

driverLocationSchema.index({ location: '2dsphere' });
driverLocationSchema.index({ driver: 1 });
driverLocationSchema.index({ updatedAt: -1 });

const DriverLocation = mongoose.model('DriverLocation', driverLocationSchema);

export default DriverLocation;
