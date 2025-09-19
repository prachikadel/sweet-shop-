import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SweetSchema = new Schema<ISweet>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    minlength: [2, 'Category must be at least 2 characters'],
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for search optimization
SweetSchema.index({ name: 1 });
SweetSchema.index({ category: 1 });
SweetSchema.index({ name: 'text', category: 'text' });

// Update updatedAt on save
SweetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Sweet = mongoose.model<ISweet>('Sweet', SweetSchema);

