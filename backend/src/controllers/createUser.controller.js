// import User from '../models/user.model.js';
// import { generateToken } from '../utils/jwt.js';
// import bcrypt from 'bcrypt';

// // @desc    Create a new user (Admin only)
// // @route   POST /api/users
// // @access  Private/Admin
// export const createUser = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       phoneNumber, 
//       password, 
//       role, 
//       // Wholesaler specific fields
//       businessName,
//       adharNumber,
//       gstNumber,
//       address
//     } = req.body;

//     // Check if user already exists with the same email or phone number
//     const userExists = await User.findOne({ 
//       $or: [
//         { email: { $ne: '', $exists: true, $eq: email } },
//         { phoneNumber }
//       ]
//     });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User with provided details already exists',
//       });
//     }

//     // Check if requester is authorized to create this role
//     if (role === 'wholesaler' && req.user.role !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Only superadmin can create wholesaler accounts',
//       });
//     }

//     // Prepare user data
//     const userData = {
//       name,
//       email,
//       phoneNumber,
//       password,
//       role: role || 'sales',
//     };

//     // Add wholesaler specific fields if role is wholesaler
//     if (role === 'wholesaler') {
//       userData.businessName = businessName;
//       userData.adharNumber = adharNumber;
//       userData.gstNumber = gstNumber;
//       userData.address = address;
//     }

//     // Create user
//     const user = await User.create(userData);

//     if (user) {
//       // Prepare response data
//       const responseData = {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         role: user.role,
//         ...(user.role === 'wholesaler' && {
//           businessName: user.businessName,
//           gstNumber: user.gstNumber,
//           address: user.address
//         })
//       };
      
//       res.status(201).json({
//         success: true,
//         data: responseData,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid user data',
//       });
//     }
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };


import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

// @desc    Create a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phoneNumber, 
      password, 
      role, 
      // Wholesaler specific fields
      businessName,
      adharNumber,
      gstNumber,
      address
    } = req.body;

    // Check if user already exists with the same email or phone number
    const userExists = await User.findOne({ 
      $or: [
        ...(email ? [{ email: { $ne: '', $eq: email } }] : []),
        { phoneNumber }
      ].filter(Boolean)
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with provided details already exists',
      });
    }

    // Check if requester is authorized to create this role
    if (role === 'wholesaler' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can create wholesaler accounts',
      });
    }

    // Prepare user data
    const userData = {
      name,
      phoneNumber,
      role: role || 'sales',
      ...(email && { email }), // Only add email if it exists
    };

    // Add password if provided
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    // Add wholesaler specific fields if role is wholesaler
    if (role === 'wholesaler') {
      userData.businessName = businessName;
      userData.gstNumber = gstNumber;
      if (adharNumber) userData.adharNumber = adharNumber;
      if (address) userData.address = address;
    }

    // Create user
    const user = await User.create(userData);

    if (user) {
      // Prepare response data
      const responseData = {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        ...(user.email && { email: user.email }), // Only include email if it exists
        ...(user.role === 'wholesaler' && {
          businessName: user.businessName,
          ...(user.gstNumber && { gstNumber: user.gstNumber }),
          ...(user.adharNumber && { adharNumber: user.adharNumber }),
          ...(user.address && { address: user.address })
        })
      };
      
      res.status(201).json({
        success: true,
        data: responseData,
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};