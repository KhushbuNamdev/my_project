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
      unique: true,
      sparse: true, // Allows multiple null/empty values for uniqueness
      default: null,
      validate: {
        validator: function(v) {
          if (v === null || v === '') return true; // Allow null or empty string
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please provide a valid email address'
      },
      set: function(v) {
        // Convert empty string to null
        return v === '' ? null : v;
      }
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      maxlength: [15, 'Phone number cannot be longer than 15 characters'],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['superadmin', 'wholesaler', 'sales'],
      required: [true, 'Role is required'],
    },
    // Wholesaler specific fields
    businessName: {
      type: String,
      trim: true,
      required: function() {
        return this.role === 'wholesaler';
      },
      validate: {
        validator: function(v) {
          if (this.role === 'wholesaler') {
            return v && v.length > 0;
          }
          return true;
        },
        message: 'Business name is required for wholesalers'
      }
    },
    adharNumber: {
      type: String,
      trim: true,
      required: false,
      default: null,
      
    },
    gstNumber: {
      type: String,
      trim: true,
      required: function() {
        return this.role === 'wholesaler';
      },
      validate: {
        validator: function(v) {
          if (this.role === 'wholesaler') {
            return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
          }
          return true;
        },
        message: 'Please provide a valid GST number'
      }
    },
    address: {
      street: {
        type: String,
        trim: true,
        required: function() {
          return this.role === 'wholesaler';
        }
      },
      city: {
        type: String,
        trim: true,
        required: function() {
          return this.role === 'wholesaler';
        }
      },
      state: {
        type: String,
        trim: true,
        required: function() {
          return this.role === 'wholesaler';
        }
      },
      pincode: {
        type: String,
        trim: true,
        required: function() {
          return this.role === 'wholesaler';
        },
        validate: {
          validator: function(v) {
            if (this.role === 'wholesaler') {
              return /^\d{6}$/.test(v);
            }
            return true;
          },
          message: 'Please provide a valid 6-digit pincode'
        }
      },
      country: {
        type: String,
        trim: true,
        default: 'India',
        required: function() {
          return this.role === 'wholesaler';
        }
      }
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
