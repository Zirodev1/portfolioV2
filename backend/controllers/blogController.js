const BlogPost = require('../models/BlogPost');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * @desc    Get all blog posts with filtering, sorting, and pagination
 * @route   GET /api/blog
 * @access  Public
 */
const getBlogPosts = async (req, res) => {
  try {
    // Prepare query
    let query = {};
    
    // Filter by status (public API should only get published posts)
    if (req.user && req.user.role === 'admin') {
      // Admin can see all posts including drafts
      if (req.query.status && req.query.status !== 'all') {
        query.status = req.query.status;
      }
    } else {
      // Public can only see published posts
      query.status = 'published';
    }
    
    // Filter by category
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    
    // Filter by featured
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    
    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }
    
    // Search by term
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    
    // Sorting
    let sortOptions = {};
    if (req.query.sort) {
      const sortField = req.query.sort.split(',')[0];
      const sortDirection = req.query.sort.split(',')[1] === 'desc' ? -1 : 1;
      sortOptions[sortField] = sortDirection;
    } else {
      // Default sort by newest published date for published posts
      if (query.status === 'published') {
        sortOptions = { publishDate: -1 };
      } else {
        // Default sort by updatedAt for all posts or drafts
        sortOptions = { updatedAt: -1 };
      }
    }
    
    // Execute query with pagination
    const posts = await BlogPost.find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit);
      
    // Get total count
    const totalPosts = await BlogPost.countDocuments(query);
    
    // Pagination results
    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    };
    
    res.json({
      success: true,
      pagination,
      data: posts,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

/**
 * @desc    Get a single blog post by slug
 * @route   GET /api/blog/:slug
 * @access  Public
 */
const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Prepare query to include or exclude drafts based on user role
    const query = { slug };
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    }
    
    const post = await BlogPost.findOne(query);
    
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Create a new blog post
 * @route   POST /api/blog
 * @access  Private/Admin
 */
const createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, thumbnail } = req.body;
    
    // Check for required fields
    if (!title || !content || !excerpt || !category || !thumbnail) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
    
    // Generate slug from title
    const slug = req.body.slug || await generateUniqueSlug(title, async (slug) => {
      const existingPost = await BlogPost.findOne({ slug });
      return !!existingPost;
    });
    
    // Prepare the author (from authenticated user or body)
    const author = req.user ? req.user.name : req.body.author;
    
    // Handle publish date for published posts
    let publishDate = null;
    if (req.body.status === 'published') {
      publishDate = req.body.publishDate || new Date();
    }
    
    // Create blog post
    const blogPost = await BlogPost.create({
      ...req.body,
      slug,
      author,
      publishDate,
    });
    
    res.status(201).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/blog/:id
 * @access  Private/Admin
 */
const updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    
    // If slug is being updated, ensure it's unique
    if (req.body.slug && req.body.slug !== blogPost.slug) {
      const existingPost = await BlogPost.findOne({ slug: req.body.slug });
      if (existingPost) {
        res.status(400);
        throw new Error('Blog post with this slug already exists');
      }
    }
    
    // If title is changed but slug isn't provided, generate a new slug
    if (req.body.title && req.body.title !== blogPost.title && !req.body.slug) {
      req.body.slug = await generateUniqueSlug(req.body.title, async (slug) => {
        const existingPost = await BlogPost.findOne({ slug });
        return !!existingPost;
      });
    }
    
    // Handle publish date for published posts
    if (
      (req.body.status === 'published' && blogPost.status !== 'published') ||
      (req.body.status === 'published' && !blogPost.publishDate)
    ) {
      // If transitioning from draft to published, set publishDate if not provided
      req.body.publishDate = req.body.publishDate || new Date();
    }
    
    // Handle tags - convert string to array if needed
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    }
    
    // Update blog post
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedBlogPost,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blog/:id
 * @access  Private/Admin
 */
const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    
    if (!blogPost) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    
    await blogPost.remove();
    
    res.json({
      success: true,
      data: {},
      message: 'Blog post removed'
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Get featured blog posts
 * @route   GET /api/blog/featured
 * @access  Public
 */
const getFeaturedBlogPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    
    const posts = await BlogPost.find({ 
      featured: true,
      status: 'published'
    })
      .sort({ publishDate: -1 })
      .limit(limit);
      
    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

/**
 * @desc    Get categories with post counts
 * @route   GET /api/blog/categories
 * @access  Public
 */
const getBlogCategories = async (req, res) => {
  try {
    // Only count published posts
    const categories = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      count: categories.length,
      data: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      })),
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

/**
 * @desc    Get tags with post counts
 * @route   GET /api/blog/tags
 * @access  Public
 */
const getBlogTags = async (req, res) => {
  try {
    // Only count published posts
    const tags = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      count: tags.length,
      data: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      })),
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getFeaturedBlogPosts,
  getBlogCategories,
  getBlogTags,
};