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
            required: [true, 'Feature index is required']
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
    }
}, {
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

// Virtual for categories
productSchema.virtual('categories', {
    ref: 'Category',
    localField: 'categoryIds',
    foreignField: '_id'
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

const Product = mongoose.model('Product', productSchema);

export default Product;
