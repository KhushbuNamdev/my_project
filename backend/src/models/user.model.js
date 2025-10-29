import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      maxlength: [15, 'Phone number cannot be longer than 15 characters'],
    },
    businessName: {
      type: String,

      trim: true,
      maxlength: [100, 'Business name cannot be more than 100 characters'],
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Please add a valid GST number (e.g., 22AAAAA0000A1Z5)'
      ],
    },
    aadharNumber: {
      type: String,
      trim: true,
      match: [
        /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/,
        'Please add a valid Aadhar number (e.g., 2345 6789 0123)'
      ],
    },
    address: {
      street: {
        type: String,

        trim: true,
      },
      city: {
        type: String,
        
        trim: true,
      },
      state: {
        type: String,
      
        trim: true,
      },
      pincode: {
        type: String,

        match: [/^[1-9][0-9]{5}$/, 'Please add a valid 6-digit pincode'],
      },
      country: {
        type: String,
        default: 'India',
      },
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['superadmin', 'wholesaler', 'sales'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!candidatePassword) {
      return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
