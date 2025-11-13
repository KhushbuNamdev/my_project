import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    images: [{
        type: String,

        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one image is required'
        }
    }],
    categoryIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'At least one category is required'],
    }],
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: 'Status must be either draft, published, or archived'
        },
        default: 'draft'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    features: [{
        index: {
            type: Number,
            default: function () {
                // Start index from 0
                return this.parent().features?.indexOf(this) ?? 0;
            }
        },
        feature: {
            type: String,
            required: [true, 'Feature description is required'],
            trim: true
        }
    }],
    gstPercentage: {
        type: Number,
        min: [0, 'GST percentage cannot be negative'],
        max: [100, 'GST percentage cannot exceed 100%'],
        default: 0
    },
    warranty: {
        type: Number,
        enum: {
            values: [6, 12, 18, 24],
            message: 'Warranty must be one of: 6, 12, 18, or 24 months'
        },
        default: 12 // Added default value
    },
    specifications: {
        type: Object,
        default: {}
    },
    'specifications.dimensions': {
        type: Object,
        default: {}
    },
    'specifications.dimensions.length': {
        type: Number,
        min: [0, 'Length cannot be negative'],
        default: 0
    },
    'specifications.dimensions.width': {
        type: Number,
        min: [0, 'Width cannot be negative'],
        default: 0
    },
    'specifications.dimensions.height': {
        type: Number,
        min: [0, 'Height cannot be negative'],
        default: 0
    },
    'specifications.cca': {
        type: Number,
        min: [0, 'CCA cannot be negative'],
        default: 0
    },
    'specifications.rc': {
        type: Number,
        min: [0, 'RC cannot be negative'],
        default: 0
    },
    'specifications.weight': {
        type: Object,
        default: { value: 0, unit: 'kg' }
    },
    'specifications.weight.value': {
        type: Number,
        min: [0, 'Weight cannot be negative'],
        default: 0
    },
    'specifications.weight.unit': {
        type: String,
        enum: {
            values: ['kg', 'g', 'lb', 'oz'],
            message: 'Weight unit must be one of: kg, g, lb, oz'
        },
        default: 'kg'
    }
},

 {
    timestamps: true,
        toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text' });
productSchema.index({ status: 1 });
productSchema.index({ categoryIds: 1 });
productSchema.index({ 'features.index': 1 });
productSchema.index({ gstPercentage: 1 });

// Pre-save hook to ensure features have proper sequential 0-based indices
productSchema.pre('save', function (next) {
    if (this.isModified('features') && Array.isArray(this.features)) {
        this.features = this.features.map((feature, index) => ({
            ...feature,
            index: index, // Always set index to array position (0, 1, 2, ...)
            feature: feature.feature?.trim()
        }));
    }
    next();
});

// Virtual for categories
productSchema.virtual('categories', {
    ref: 'Category',
    localField: 'categoryIds',
    foreignField: '_id'
});

// Virtual for inventory summary
productSchema.virtual('inventorySummary', {
    ref: 'Inventory',
    localField: '_id',
    foreignField: 'productId',
    options: {
        match: { isActive: { $ne: false } },
        select: 'quantity usedQuantity status'
    }
});

// Virtual for total quantity (not stored in DB)
productSchema.virtual('totalQuantity').get(async function () {
    const Inventory = mongoose.model('Inventory');
    const result = await Inventory.aggregate([
        {
            $match: {
                productId: this._id,
                isActive: { $ne: false }
            }
        },
        {
            $group: {
                _id: null,
                totalQuantity: { $sum: '$quantity' },
                totalUsed: { $sum: '$usedQuantity' },
                available: { $sum: { $subtract: ['$quantity', '$usedQuantity'] } },
                count: { $sum: 1 }
            }
        }
    ]);

    return result[0] || {
        totalQuantity: 0,
        totalUsed: 0,
        available: 0,
        count: 0
    };
});

// Middleware to check if referenced categories exist
productSchema.pre('save', async function (next) {
    if (this.isModified('categoryIds')) {
        const categories = await mongoose.model('Category').find({
            _id: { $in: this.categoryIds },
            isDeleted: false
        });

        if (categories.length !== this.categoryIds.length) {
            throw new Error('One or more categories do not exist or have been deleted');
        }
    }
    next();
});

// Add toJSON and toObject options to include virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
