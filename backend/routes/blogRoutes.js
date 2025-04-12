const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getFeaturedBlogPosts,
  getBlogCategories,
  getBlogTags,
  autosaveBlogPost
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// TEST endpoint for debugging - get all posts
router.get('/test-all', async (req, res) => {
  try {
    // Directly use the BlogPost model
    const BlogPost = require('../models/BlogPost');
    const posts = await BlogPost.find();
    
    console.log("Found", posts.length, "blog posts");
    
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// TEST endpoint to reset blog data (DANGEROUS - only for development)
router.get('/reset-test-data', async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is only available in development'
      });
    }
    
    // Get the BlogPost model
    const BlogPost = require('../models/BlogPost');
    
    // Delete all posts
    await BlogPost.deleteMany({});
    
    // Create one test post
    const testPost = await BlogPost.create({
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      content: {
        time: Date.now(),
        blocks: [
          {
            id: '1',
            type: 'paragraph',
            data: {
              text: 'This is a test blog post created for development purposes.'
            }
          }
        ],
        version: '2.31.0'
      },
      excerpt: 'A test blog post excerpt',
      category: 'Web Development',
      tags: ['test', 'development'],
      thumbnail: '/assets/images/blog-1.jpg',
      status: 'draft',
      author: 'Admin'
    });
    
    res.json({
      success: true,
      message: 'Blog data reset successfully',
      testPost
    });
  } catch (error) {
    console.error('Error resetting test data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// Public routes
router.get('/', getBlogPosts);
router.get('/featured', getFeaturedBlogPosts);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/:slug', getBlogPostBySlug);

// Temporarily making all routes public for testing
router.post('/', createBlogPost);
router.post('/autosave', autosaveBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

// Protected routes - commented out for testing
// router.post('/', protect, authorize('admin'), createBlogPost);
// router.post('/autosave', protect, authorize('admin'), autosaveBlogPost);
// router.put('/:id', protect, authorize('admin'), updateBlogPost);
// router.delete('/:id', protect, authorize('admin'), deleteBlogPost);

module.exports = router;