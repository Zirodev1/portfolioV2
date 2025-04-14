const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot be more than 200 characters']
    },
    client: {
      type: String,
      trim: true,
    },
    completionDate: {
      type: Date,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['Web Development', 'Mobile App', 'UI/UX Design', 'E-commerce', 'Frontend', 'Backend', 'Full Stack', 'Other'],
    },
    tags: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    thumbnail: {
      type: String,
      required: [true, 'Project thumbnail is required'],
    },
    images: [String], // Gallery images
    liveUrl: String,
    githubUrl: String,
    challenge: String,
    solution: String,
    results: String,
    testimonial: {
      quote: String,
      author: String,
      position: String,
      company: String
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    // For SEO
    metaDescription: String,
    metaKeywords: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create text indexes for search
projectSchema.index({ 
  title: 'text',
  description: 'text',
  technologies: 'text',
  tags: 'text'
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 