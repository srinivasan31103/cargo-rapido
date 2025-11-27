import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'scooter', 'auto', 'mini-truck', 'truck'],
    required: true
  },
  vehicleModel: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  vehicleColor: String,
  maxCapacity: {
    weight: {
      type: Number,
      required: true
    },
    volume: Number,
    unit: {
      type: String,
      default: 'kg'
    }
  },
  cargoSizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL']
  }],
  registrationExpiry: {
    type: Date,
    required: true
  },
  insuranceExpiry: {
    type: Date,
    required: true
  },
  pollutionCertExpiry: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
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

vehicleSchema.index({ driver: 1, isActive: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
