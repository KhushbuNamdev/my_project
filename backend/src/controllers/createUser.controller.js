import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Create a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role: role || 'sales',
    });

    if (user) {
      const { _id, name, email, role } = user;
      
      res.status(201).json({
        success: true,
        data: {
          _id,
          name,
          email,
          role,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
