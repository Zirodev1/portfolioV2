const BlogPost = require('../models/BlogPost');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * @desc    Get all blog posts with filtering, sorting, and pagination
 * @route   GET /api/blog
 * @access  Public
 */
const getBlogPosts = async (req, res) => {
  try {
    const { category, limit = 10, status, sort } = req.query;
    
    console.log('Blog query params:', req.query);
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    console.log('MongoDB query:', query);
    
    // Build sort object
    let sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(',');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      // Default sort by createdAt desc
      sortOptions = { createdAt: -1 };
    }
    
    console.log('Sort options:', sortOptions);
    
    // Execute query
    let posts = await BlogPost.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit));
    
    console.log(`Found ${posts.length} blog posts`);
    if (posts.length === 0) {
      console.log('No posts found matching query');
    } else {
      // Log the first post as a sample
      console.log('Sample post:', {
        id: posts[0]._id,
        title: posts[0].title,
        status: posts[0].status,
        createdAt: posts[0].createdAt
      });
    }
    
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error getting blog posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
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
    
    console.log(`Finding blog post with slug: "${slug}"`);
    
    // Prepare query to include or exclude drafts based on user role
    const query = { slug };
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    }
    
    console.log('MongoDB query:', query);
    
    const post = await BlogPost.findOne(query);
    
    if (!post) {
      console.log(`Blog post not found with slug: "${slug}"`);
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    console.log(`Found blog post: ${post.title} (${post._id})`);
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Create a new blog post
 * @route   POST /api/blog
 * @access  Private/Admin
 */
const createBlogPost = async (req, res) => {
  try {
    console.log("Create blog post request:", req.body);
    const { title, content, excerpt, des, category, tags, thumbnail, banner, draft = false } = req.body;
    
    // Check for required fields
    if (!title) {
      console.log("Missing required field: title");
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    // Map frontend field names to backend field names
    const mappedExcerpt = excerpt || des || title.substring(0, 150) + '...';
    const mappedThumbnail = thumbnail || banner || '';
    
    // Generate slug from title
    const slug = req.body.slug || await generateUniqueSlug(title, async (slug) => {
      const existingPost = await BlogPost.findOne({ slug });
      return !!existingPost;
    });
    
    // Prepare the author (from authenticated user or body)
    const author = req.user ? req.user.name : (req.body.author || 'Admin');
    
    // Handle publish date for published posts
    let publishDate = null;
    const status = draft === true ? 'draft' : (req.body.status || 'draft');
    
    if (status === 'published') {
      publishDate = req.body.publishDate || new Date();
    }
    
    // Create blog post with all required fields
    const blogPostData = {
      title,
      slug,
      content: content || {},
      excerpt: mappedExcerpt,
      category: category || 'Web Development', // Default category
      author,
      thumbnail: mappedThumbnail,
      tags: tags || [],
      status,
      publishDate
    };
    
    console.log("Creating blog post with data:", blogPostData);
    
    const blogPost = await BlogPost.create(blogPostData);
    
    console.log("Blog post created with ID:", blogPost._id);
    
    res.status(201).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/blog/:id
 * @access  Private/Admin
 */
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("Update request for blog post ID:", id);
    console.log("Update data:", req.body);
    
    // Find blog post
    let blog = await BlogPost.findById(id);
    
    if (!blog) {
      console.log("Blog post not found with ID:", id);
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    // Process update data
    const updateData = {
      ...req.body,
      slug: req.body.slug || blog.slug, // Keep existing slug if not provided
      status: req.body.draft ? 'draft' : (req.body.status || blog.status),
      excerpt: req.body.excerpt || req.body.des || blog.excerpt,
      thumbnail: req.body.thumbnail || req.body.banner || blog.thumbnail,
      publishDate: req.body.status === 'published' && !blog.publishDate ? new Date() : blog.publishDate
    };
    
    // Update blog post
    blog = await BlogPost.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    
    console.log("Blog post updated successfully:", blog._id);
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blog/:id
 * @access  Private/Admin
 */
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("Delete request for blog post ID:", id);
    
    const blog = await BlogPost.findById(id);
    
    if (!blog) {
      console.log("Blog post not found with ID:", id);
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }
    
    await blog.deleteOne();
    
    console.log("Blog post deleted successfully:", id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
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

/**
 * @desc    Auto-save a blog post
 * @route   POST /api/blog/autosave
 * @access  Private/Admin
 */
const autosaveBlogPost = async (req, res) => {
  try {
    const { title, banner, content, des, tags, draft, id } = req.body;
    
    console.log("Autosave request body:", req.body);
    
    // Create an object with the properties we want to save
    const blogData = {
      title: title || 'Untitled Draft',
      content: content || {},
      thumbnail: banner || '',
      excerpt: des || 'Draft excerpt...', // Default excerpt to prevent validation errors
      tags: tags || [],
      status: 'draft',
      category: 'Web Development', // Default category to prevent validation errors
      author: req.user ? req.user.name : 'Admin'
    };
    
    console.log("Prepared blog data for save:", blogData);
    
    let blogPost;
    
    // If blog post ID exists, update it
    if (id) {
      blogPost = await BlogPost.findById(id);
      
      if (!blogPost) {
        // If the post doesn't exist, create a new one
        // Generate a slug from the title
        const slug = await generateUniqueSlug(title || 'untitled-draft', async (slug) => {
          const existingPost = await BlogPost.findOne({ slug });
          return !!existingPost;
        });
        
        blogPost = await BlogPost.create({
          ...blogData,
          slug
        });
        
        console.log("Created new blog post:", blogPost._id);
      } else {
        // Update existing blog post
        Object.assign(blogPost, blogData);
        await blogPost.save();
        console.log("Updated existing blog post:", blogPost._id);
      }
    } else {
      // Create a new blog post
      // Generate a slug from the title
      const slug = await generateUniqueSlug(title || 'untitled-draft', async (slug) => {
        const existingPost = await BlogPost.findOne({ slug });
        return !!existingPost;
      });
      
      blogPost = await BlogPost.create({
        ...blogData,
        slug
      });
      
      console.log("Created new blog post:", blogPost._id);
    }
    
    res.status(200).json({
      success: true,
      data: blogPost,
      message: 'Blog post auto-saved'
    });
  } catch (error) {
    console.error('Auto-save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during auto-save'
    });
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
  autosaveBlogPost
};