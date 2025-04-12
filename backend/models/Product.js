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
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot be more than 200 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative']
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Website Template', 'React Component', 'Full Stack App', 'UI Kit', 'Plugin', 'Other'],
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
      required: [true, 'Product thumbnail is required'],
    },
    images: [String], // Additional product images
    downloadFile: {
      key: String,       // S3 object key
      filename: String,  // Original filename for display
      size: Number,      // File size in bytes
      contentType: String // MIME type
    },
    demoUrl: String,     // Live demo URL if available
    features: [String],  // List of product features
    technologies: [String], // Technologies used (React, Node, etc.)
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    downloads: {
      type: Number,
      default: 0
    },
    purchaseCount: {
      type: Number,
      default: 0
    },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add a virtual field for the current price (either sale price or regular price)
productSchema.virtual('currentPrice').get(function() {
  return this.onSale && this.salePrice ? this.salePrice : this.price;
});

// Create text indexes for search
productSchema.index({ 
  title: 'text',
  description: 'text',
  technologies: 'text'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;