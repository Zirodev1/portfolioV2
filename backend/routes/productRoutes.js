const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadProductFile,
  getDownloadUrl
} = require('../controllers/productController');

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for S3 upload
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// File upload route
router.post('/:id/upload', upload.single('file'), uploadProductFile);

// Download route
router.get('/:id/download', getDownloadUrl);

module.exports = router;