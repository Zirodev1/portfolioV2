const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog post slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Blog post content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Blog post excerpt is required'],
      maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    },
    category: {
      type: String,
      required: [true, 'Blog post category is required'],
      enum: [
        'Web Development',
        'Frontend',
        'Backend',
        'DevOps',
        'Tutorials',
        'Career',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail image is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      default: null,
    },
    readTime: {
      type: String,
      default: '',
    },
    relatedPosts: [
      {
        slug: String,
        title: String,
        thumbnail: String,
        category: String,
      },
    ],
    metaDescription: String,
    metaKeywords: String,
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual field for formatted date
blogPostSchema.virtual('formattedDate').get(function () {
  return this.publishDate
    ? new Date(this.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
});

// Calculate read time before saving
blogPostSchema.pre('save', function (next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  this.readTime = `${minutes} min read`;
  
  // Set publishDate if status changes to published
  if (this.status === 'published' && !this.publishDate) {
    this.publishDate = new Date();
  }
  
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;