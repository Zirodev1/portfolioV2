const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  getProducts, 
  getProductBySlug, 
  getProductById,
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
router.get('/by-id/:id', getProductById);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// File upload route
router.post('/:id/upload', upload.single('file'), uploadProductFile);

// Download route
router.get('/:id/download', getDownloadUrl);

// Test AWS connection route
router.get('/test-aws', async (req, res) => {
  try {
    const s3 = require('../config/aws').s3;
    const bucketName = process.env.AWS_BUCKET;
    
    console.log('Testing AWS connection with config:', {
      region: process.env.AWS_REGION,
      bucket: bucketName,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    });
    
    // List buckets to test credentials
    const listBucketsResult = await s3.listBuckets().promise();
    console.log('AWS Buckets:', listBucketsResult.Buckets.map(b => b.Name));
    
    // Check if our target bucket exists
    const bucketExists = listBucketsResult.Buckets.some(b => b.Name === bucketName);
    
    // List objects in the bucket (if it exists)
    let objects = [];
    if (bucketExists) {
      const listObjectsResult = await s3.listObjects({ Bucket: bucketName, MaxKeys: 5 }).promise();
      objects = listObjectsResult.Contents || [];
      console.log(`Found ${objects.length} objects in bucket ${bucketName}`);
    }
    
    res.json({
      success: true,
      message: 'AWS connection test successful',
      data: {
        buckets: listBucketsResult.Buckets.map(b => b.Name),
        targetBucket: bucketName,
        bucketExists,
        sampleObjects: objects.map(o => ({ key: o.Key, size: o.Size, lastModified: o.LastModified }))
      }
    });
  } catch (error) {
    console.error('AWS connection test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

module.exports = router;