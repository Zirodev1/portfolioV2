const path = require('path');
const fs = require('fs');
const { UPLOAD_PATH } = require('../config/config');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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

/**
 * @desc    Generate a pre-signed URL for direct S3 upload
 * @route   GET /api/upload/get-upload-url
 * @access  Private/Admin
 */
const getUploadUrl = async (req, res) => {
  try {
    const fileName = `${uuidv4()}.jpg`;
    
    // Create a direct upload URL with appropriate headers for CORS - removed ACL
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `uploads/${fileName}`,
      ContentType: 'image/jpeg',
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    const uploadURL = s3.getSignedUrl('putObject', params);
    
    // Return the URL and the eventual public URL of the image
    res.json({ 
      uploadURL,
      imageUrl: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate upload URL'
    });
  }
};

/**
 * @desc    Upload an image to S3 and return the URL
 * @route   POST /api/upload/image
 * @access  Public
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Log information about the uploaded file
    console.log('File received for S3 upload:', req.file.originalname);
    
    // Verify AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET || !process.env.AWS_REGION) {
      console.error('Missing AWS credentials');
      return res.status(500).json({
        success: false,
        error: 'AWS configuration is incomplete'
      });
    }

    // Read the file from disk
    const fileContent = fs.readFileSync(req.file.path);
    
    // Generate a unique filename
    const fileName = `uploads/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    
    // Set up the S3 upload parameters - removed ACL parameter
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype
    };
    
    console.log('Uploading to S3:', { bucket: params.Bucket, key: params.Key });

    // Upload to S3 using promises
    const data = await s3.upload(params).promise();
    console.log('S3 upload successful:', data.Location);
    
    // Clean up the local temp file
    fs.unlinkSync(req.file.path);
    
    // Return success with the image URL
    return res.status(200).json({
      success: true,
      imageUrl: data.Location
    });
  } catch (error) {
    console.error('Error in uploadImage:', error);
    
    // More specific error message if it's an S3 error
    if (error.code && error.code.startsWith('AWS')) {
      return res.status(500).json({
        success: false,
        error: 'Failed to upload to S3',
        details: error.message
      });
    }
    
    // General error
    return res.status(500).json({
      success: false,
      error: 'Server error uploading image',
      details: error.message
    });
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFiles,
  getUploadUrl,
  uploadImage
};