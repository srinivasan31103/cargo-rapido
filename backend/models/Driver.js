import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    default: 'driver'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required']
  },
  licenseExpiry: {
    type: Date,
    required: true
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true
  },
  panNumber: {
    type: String
  },
  documents: {
    licensePhoto: String,
    aadharPhoto: String,
    panPhoto: String,
    vehicleRC: String,
    profilePhoto: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    upiId: String
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  kycRejectionReason: String,
  status: {
    type: String,
    enum: ['offline', 'online', 'busy'],
    default: 'offline'
  },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    address: String,
    updatedAt: Date
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  stats: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    completedDeliveries: {
      type: Number,
      default: 0
    },
    cancelledDeliveries: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    pendingPayout: {
      type: Number,
      default: 0
    }
  },
  availability: {
    monday: { available: Boolean, slots: [{ start: String, end: String }] },
    tuesday: { available: Boolean, slots: [{ start: String, end: String }] },
    wednesday: { available: Boolean, slots: [{ start: String, end: String }] },
    thursday: { available: Boolean, slots: [{ start: String, end: String }] },
    friday: { available: Boolean, slots: [{ start: String, end: String }] },
    saturday: { available: Boolean, slots: [{ start: String, end: String }] },
    sunday: { available: Boolean, slots: [{ start: String, end: String }] }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
driverSchema.index({ currentLocation: '2dsphere' });
driverSchema.index({ status: 1, kycStatus: 1 });

// Encrypt password before saving
driverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
driverSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
