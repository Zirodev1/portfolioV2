const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Templates', 'UI Kits', 'Notion', 'Framer', 'Figma'],
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail image is required'],
    },
    images: [String], // Additional product images
    details: {
      version: String,
      lastUpdated: Date,
      includes: [String],
      features: [String],
    },
    faq: [
      {
        question: String,
        answer: String,
      },
    ],
    testimonials: [
      {
        quote: String,
        author: String,
        role: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search
productSchema.index({ title: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;