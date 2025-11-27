import User from '../models/User.js';
import Driver from '../models/Driver.js';
import { generateToken } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/emailService.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'user'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        message: 'Account is blocked',
        reason: user.blockedReason || 'Please contact support'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        wallet: user.wallet,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerDriver = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      licenseNumber,
      licenseExpiry,
      aadharNumber,
      panNumber
    } = req.body;

    const driverExists = await Driver.findOne({ $or: [{ email }, { phone }] });
    if (driverExists) {
      return res.status(400).json({ message: 'Driver already exists' });
    }

    const driver = await Driver.create({
      name,
      email,
      phone,
      password,
      licenseNumber,
      licenseExpiry,
      aadharNumber,
      panNumber,
      role: 'driver'
    });

    const token = generateToken(driver._id, 'driver');

    res.status(201).json({
      success: true,
      data: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        role: driver.role,
        kycStatus: driver.kycStatus,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email }).select('+password');
    if (!driver) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if driver is blocked
    if (driver.isBlocked) {
      return res.status(403).json({
        message: 'Account is blocked',
        reason: driver.blockedReason || 'Please contact support'
      });
    }

    const isMatch = await driver.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(driver._id, 'driver');

    res.json({
      success: true,
      data: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        role: driver.role,
        status: driver.status,
        kycStatus: driver.kycStatus,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (req.user) {
      res.json({
        success: true,
        data: req.user
      });
    } else if (req.driver) {
      const driver = await Driver.findById(req.driver._id).populate('vehicle');
      res.json({
        success: true,
        data: driver
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.role;

    if (req.user) {
      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true
      });
      res.json({ success: true, data: user });
    } else if (req.driver) {
      const driver = await Driver.findByIdAndUpdate(req.driver._id, updates, {
        new: true,
        runValidators: true
      });
      res.json({ success: true, data: driver });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide both current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    let account;
    if (req.user) {
      account = await User.findById(req.user._id).select('+password');
    } else if (req.driver) {
      account = await Driver.findById(req.driver._id).select('+password');
    }

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Verify current password
    const isMatch = await account.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    account.password = newPassword;
    await account.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, userType = 'user' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    let account;
    if (userType === 'driver') {
      account = await Driver.findOne({ email });
    } else {
      account = await User.findOne({ email });
    }

    if (!account) {
      // Don't reveal if account exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    account.resetPasswordToken = resetToken;
    account.resetPasswordExpire = resetTokenExpiry;
    await account.save();

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&type=${userType}`;

    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent',
      // Only include token in development mode
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, userType = 'user' } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Please provide token and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    let account;
    if (userType === 'driver') {
      account = await Driver.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });
    } else {
      account = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });
    }

    if (!account) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    account.password = newPassword;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;
    await account.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
