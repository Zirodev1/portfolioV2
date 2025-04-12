const express = require('express');
const router = express.Router();
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFiles,
  getUploadUrl,
  uploadImage
} = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// Public route for getting S3 upload URL
router.get('/get-upload-url', getUploadUrl);

// New route for uploading images through the backend
router.post('/image', upload.single('image'), uploadImage);

// All other routes are protected for admin only
router.use(protect, authorize('admin'));

// Get all uploaded files
router.get('/', getFiles);

// Upload a single file
router.post('/', upload.single('file'), handleUploadError, uploadFile);

// Upload multiple files
router.post('/multiple', upload.array('files', 10), handleUploadError, uploadMultipleFiles);

// Delete a file
router.delete('/:filename', deleteFile);

module.exports = router;