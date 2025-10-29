import TokenService from '../services/token.service.js';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Verify and decode token
    const decoded = TokenService.verifyToken(token);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Ensure we have the user ID available
    req.user = {
      ...user.toObject(),
      _id: user._id
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    const statusCode = error.message.includes('expired') ? 401 : 403;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Not authorized',
    });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
