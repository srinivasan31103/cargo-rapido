import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  type: {
    type: String,
    enum: [
      'booking_payment',
      'wallet_recharge',
      'refund',
      'cashback',
      'driver_earning',
      'driver_payout',
      'subscription',
      'penalty'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'card', 'upi', 'netbanking', 'cash']
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paytm']
  },
  transactionId: String,
  gatewayTransactionId: String,
  gatewayOrderId: String,
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  balanceBefore: Number,
  balanceAfter: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ driver: 1, createdAt: -1 });
transactionSchema.index({ booking: 1 });
transactionSchema.index({ transactionId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
