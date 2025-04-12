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
      type: mongoose.Schema.Types.Mixed,
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

// Create text indexes for search on safe fields only
blogPostSchema.index({ title: 'text', tags: 'text' });

// Add a custom text search method for content since it can be an object
blogPostSchema.statics.searchByContent = async function(query) {
  // First find posts with matching title or tags
  const posts = await this.find({
    $text: { $search: query }
  });
  
  // Then filter posts with content containing the query if content is in EditorJS format
  const contentMatches = await this.find().then(allPosts => {
    return allPosts.filter(post => {
      if (typeof post.content === 'string') {
        return post.content.toLowerCase().includes(query.toLowerCase());
      } else if (post.content && post.content.blocks) {
        // Search through blocks of EditorJS content
        return post.content.blocks.some(block => {
          if (block.data && block.data.text) {
            return block.data.text.toLowerCase().includes(query.toLowerCase());
          }
          return false;
        });
      }
      return false;
    });
  });
  
  // Combine results and remove duplicates
  const allMatches = [...posts, ...contentMatches];
  const uniqueIds = new Set();
  
  return allMatches.filter(post => {
    if (uniqueIds.has(post.id)) {
      return false;
    }
    uniqueIds.add(post.id);
    return true;
  });
};

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
  
  // Check if content is string or object (EditorJS format)
  let wordCount = 0;
  
  if (typeof this.content === 'string') {
    // If content is a string, count words directly
    wordCount = this.content.split(/\s+/).length;
  } else if (this.content && this.content.blocks) {
    // If content is EditorJS format, extract text from blocks
    wordCount = this.content.blocks.reduce((count, block) => {
      // Count words in block content if it exists and is a string
      if (block.data && block.data.text) {
        return count + block.data.text.split(/\s+/).length;
      }
      return count;
    }, 0);
  }
  
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