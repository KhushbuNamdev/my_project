import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
        unique: true
    },
    quantity: {
        type: Number,
        required: [true, 'Total quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    usedQuantity: {
        type: Number,
        required: [true, 'Used quantity is required'],
        min: [0, 'Used quantity cannot be negative'],
        default: 0,
        validate: {
            validator: function(v) {
                return v <= this.quantity;
            },
            message: 'Used quantity cannot exceed total quantity'
        }
    },
    availableQuantity: {
        type: Number,
        default: function() {
            return this.quantity - this.usedQuantity;
        },
        min: [0, 'Available quantity cannot be negative']
    },
    status: {
        type: String,
        enum: {
            values: ['in_stock', 'low_stock', 'out_of_stock'],
            message: 'Status must be either in_stock, low_stock, or out_of_stock'
        },
        default: 'out_of_stock'
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        min: [1, 'Low stock threshold must be at least 1']
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update availableQuantity before saving
inventorySchema.pre('save', function(next) {
    this.availableQuantity = this.quantity - this.usedQuantity;
    
    // Update status based on available quantity
    if (this.availableQuantity <= 0) {
        this.status = 'out_of_stock';
    } else if (this.availableQuantity <= this.lowStockThreshold) {
        this.status = 'low_stock';
    } else {
        this.status = 'in_stock';
    }
    
    next();
});

// Virtual for product details
inventorySchema.virtual('product', {
    ref: 'Product',
    localField: 'productId',
    foreignField: '_id',
    justOne: true
});

// Indexes for better query performance
inventorySchema.index({ productId: 1 }, { unique: true });
inventorySchema.index({ status: 1 });
inventorySchema.index({ availableQuantity: 1 });

// Static method to update stock
inventorySchema.statics.updateStock = async function(productId, quantityChange, isUsed = false) {
    const updateField = isUsed ? 'usedQuantity' : 'quantity';
    const inventory = await this.findOneAndUpdate(
        { productId },
        { 
            $inc: { [updateField]: quantityChange },
            $set: { lastRestocked: new Date() }
        },
        { new: true, upsert: true }
    );
    
    return inventory;
};

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
