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
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBlogPosts);
router.get('/featured', getFeaturedBlogPosts);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/:slug', getBlogPostBySlug);

// Protected routes - admin only
router.post('/', protect, authorize('admin'), createBlogPost);
router.put('/:id', protect, authorize('admin'), updateBlogPost);
router.delete('/:id', protect, authorize('admin'), deleteBlogPost);

module.exports = router;