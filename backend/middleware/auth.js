import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Driver from '../models/Driver.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's a driver or user
      if (decoded.role === 'driver') {
        req.driver = await Driver.findById(decoded.id).select('-password');
        req.userRole = 'driver';
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        req.userRole = decoded.role;
      }

      if (!req.user && !req.driver) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole || (req.user?.role) || (req.driver?.role);

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `User role '${userRole}' is not authorized to access this route`
      });
    }
    next();
  };
};

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
