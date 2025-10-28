import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
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
          token: generateToken(_id, role),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // If everything is correct, generate token
    const { _id, name, role } = user;
    const token = generateToken(_id, role);
    
    res.json({
      success: true,
      data: {
        _id,
        name,
        email: user.email,
        role,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
