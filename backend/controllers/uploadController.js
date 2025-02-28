const path = require('path');
const fs = require('fs');
const { UPLOAD_PATH } = require('../config/config');

/**
 * @desc    Upload a file
 * @route   POST /api/upload
 * @access  Private/Admin
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file',
      });
    }

    // Return the file information
    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: `/${UPLOAD_PATH}${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error during upload',
    });
  }
};

/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/multiple
 * @access  Private/Admin
 */
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one file',
      });
    }

    // Return all file information
    const files = req.files.map((file) => ({
      filename: file.filename,
      path: `/${UPLOAD_PATH}${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    }));

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error during upload',
    });
  }
};

/**
 * @desc    Delete a file
 * @route   DELETE /api/upload/:filename
 * @access  Private/Admin
 */
const deleteFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_PATH, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      data: {},
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error during file deletion',
    });
  }
};

/**
 * @desc    Get all uploaded files
 * @route   GET /api/upload
 * @access  Private/Admin
 */
const getFiles = async (req, res) => {
  try {
    // Read the upload directory
    const files = fs.readdirSync(UPLOAD_PATH);

    // Get detailed information for each file
    const filesInfo = files.map((filename) => {
      const filePath = path.join(UPLOAD_PATH, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        path: `/${UPLOAD_PATH}${filename}`,
        size: stats.size,
        created: stats.birthtime,
      };
    });

    // Sort files by creation date (newest first)
    filesInfo.sort((a, b) => new Date(b.created) - new Date(a.created));

    res.status(200).json({
      success: true,
      count: filesInfo.length,
      data: filesInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while retrieving files',
    });
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFiles,
};