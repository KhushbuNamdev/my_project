import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema({
    serialNumber: {
        type: String,
        required: [true, 'Serial number is required'],
        trim: true,
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
        index: true // Add non-unique index for better query performance
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
            validator: function (v) {
                return v <= this.quantity;
            },
            message: 'Used quantity cannot exceed total quantity'
        }
    },
    availableQuantity: {
        type: Number,
        default: function () {
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
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update availableQuantity before saving
inventorySchema.pre('save', function (next) {
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

// Static method to update stock for a specific inventory record
inventorySchema.statics.updateStock = async function (inventoryId, quantityChange, isUsed = false) {
    const updateField = isUsed ? 'usedQuantity' : 'quantity';

    // Find the specific inventory record by ID
    const inventory = await this.findById(inventoryId);

    if (!inventory) {
        throw new Error('Inventory record not found');
    }

    // Update the specific inventory record
    inventory[updateField] += quantityChange;
    inventory.lastRestocked = new Date();

    // This will trigger the pre-save hook to update availableQuantity and status
    return await inventory.save();
};

// Method to get current stock level for a product (sum of all inventory records)
inventorySchema.statics.getProductStock = async function (productId) {
    // Convert productId to ObjectId if it's a string
    const productObjectId = typeof productId === 'string'
        ? new mongoose.Types.ObjectId(productId)
        : productId;

    const result = await this.aggregate([
        {
            $match: {
                productId: productObjectId,
                isActive: { $ne: false } // Only count active inventory records
            }
        },
        {
            $group: {
                _id: '$productId',
                totalQuantity: { $sum: '$quantity' },
                totalUsed: { $sum: '$usedQuantity' },
                available: { $sum: { $subtract: ['$quantity', '$usedQuantity'] } },
                count: { $sum: 1 }
            }
        }
    ]);

    if (result.length === 0) {
        return {
            totalQuantity: 0,
            totalUsed: 0,
            available: 0,
            count: 0
        };
    }

    return result[0];
};

// Add a compound index for better query performance
inventorySchema.index({ productId: 1, createdAt: -1 });

// Add compound index for better query performance
inventorySchema.index({ productId: 1, createdAt: -1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
