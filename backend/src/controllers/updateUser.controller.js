import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

      // Only update role if the requester is a superadmin
      if (req.body.role && req.user.role === 'superadmin') {
        user.role = req.body.role;
      }

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const { _id, name, email, role } = updatedUser;

      res.json({
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
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Common fields that can be updated for all roles
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

      // Only superadmin can update role
      if (req.body.role) {
        user.role = req.body.role;
      }

      // Update wholesaler specific fields
      if (user.role === 'wholesaler') {
        user.businessName = req.body.businessName || user.businessName;
        user.gstNumber = req.body.gstNumber || user.gstNumber;
        user.adharNumber = req.body.adharNumber || user.adharNumber;

        // Update address if provided
        if (req.body.address) {
          user.address = {
            street: req.body.address.street || user.address?.street || '',
            city: req.body.address.city || user.address?.city || '',
            state: req.body.address.state || user.address?.state || '',
            pincode: req.body.address.pincode || user.address?.pincode || '',
            country: req.body.address.country || user.address?.country || 'India'
          };
        }
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const { _id, name, email, role } = updatedUser;

      res.json({
        success: true,
        data: {
          _id,
          name,
          email,
          role,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
