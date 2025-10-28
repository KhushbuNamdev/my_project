import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for getting subcategories
categorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentId'
});

// Add a pre-remove hook to handle subcategories when a category is deleted
categorySchema.pre('remove', async function(next) {
    try {
        // Find all subcategories of the category being removed
        const subcategories = await this.model('Category').find({ parentId: this._id });
        
        // Update all subcategories to have no parent (make them root categories)
        await Promise.all(subcategories.map(subcategory => {
            subcategory.parentId = null;
            return subcategory.save();
        }));
        
        next();
    } catch (error) {
        next(error);
    }
});

// Index for better query performance
categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
