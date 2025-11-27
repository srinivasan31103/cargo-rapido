import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';

// Lazy initialize Razorpay to allow .env to load first
let razorpay = null;
const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const userId = req.user._id;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        userId: userId.toString()
      }
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const userId = req.user._id;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update booking payment status
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.payment.status = 'completed';
    booking.payment.transactionId = razorpay_payment_id;
    booking.payment.paidAt = new Date();
    await booking.save();

    // Create transaction record
    await Transaction.create({
      user: userId,
      booking: bookingId,
      type: 'booking_payment',
      amount: booking.pricing.total,
      status: 'completed',
      paymentMethod: booking.payment.method,
      paymentGateway: 'razorpay',
      transactionId: razorpay_payment_id,
      gatewayOrderId: razorpay_order_id,
      description: `Payment for booking ${booking.bookingId}`
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rechargeWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum recharge amount is ₹100' });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `wallet_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        type: 'wallet_recharge'
      }
    };

    const order = await getRazorpay().orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyWalletRecharge = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount
    } = req.body;

    const userId = req.user._id;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update user wallet
    const user = await User.findById(userId);
    const balanceBefore = user.wallet.balance;
    user.wallet.balance += amount;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: userId,
      type: 'wallet_recharge',
      amount,
      status: 'completed',
      paymentGateway: 'razorpay',
      transactionId: razorpay_payment_id,
      gatewayOrderId: razorpay_order_id,
      balanceBefore,
      balanceAfter: user.wallet.balance,
      description: 'Wallet recharge'
    });

    res.json({
      success: true,
      message: 'Wallet recharged successfully',
      data: {
        balance: user.wallet.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payWithWallet = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const user = await User.findById(userId);
    if (user.wallet.balance < booking.pricing.total) {
      return res.status(400).json({
        message: 'Insufficient wallet balance',
        balance: user.wallet.balance,
        required: booking.pricing.total
      });
    }

    // Deduct from wallet
    const balanceBefore = user.wallet.balance;
    user.wallet.balance -= booking.pricing.total;
    await user.save();

    // Update booking
    booking.payment.status = 'completed';
    booking.payment.method = 'wallet';
    booking.payment.paidAt = new Date();
    await booking.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: userId,
      booking: bookingId,
      type: 'booking_payment',
      amount: -booking.pricing.total,
      status: 'completed',
      paymentMethod: 'wallet',
      balanceBefore,
      balanceAfter: user.wallet.balance,
      description: `Payment for booking ${booking.bookingId}`
    });

    res.json({
      success: true,
      message: 'Payment successful',
      data: {
        booking,
        transaction,
        walletBalance: user.wallet.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type } = req.query;

    const query = { user: userId };
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('booking', 'bookingId status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('wallet');

    res.json({
      success: true,
      data: user.wallet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
