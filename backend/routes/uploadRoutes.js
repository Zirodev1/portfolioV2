const express = require('express');
const router = express.Router();
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFiles,
} = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// All routes are protected for admin only
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