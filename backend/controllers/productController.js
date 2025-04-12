const Product = require('../models/Product');
const { generateUniqueSlug } = require('../utils/slugify');
const aws = require('../config/aws');
const s3 = aws.s3;
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'portfolio-templates-zirodev';

/**
 * @desc    Get all products with filtering and sorting
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { category, status, featured, limit = 10, sort = 'createdAt,desc' } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // For public routes, only show published products
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    } else if (status && status !== 'all') {
      // If admin and status filter provided
      query.status = status;
    }
    
    // Filter featured products
    if (featured === 'true') {
      query.featured = true;
    }
    
    console.log('Product query:', query);
    
    // Parse sort option
    const [sortField, sortOrder] = sort.split(',');
    const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get a single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // For non-admin users, only show published products
    const query = { slug };
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    }
    
    const product = await Product.findOne(query);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    // Check required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, description, price and category'
      });
    }
    
    // Generate slug if not provided
    const slug = req.body.slug || await generateUniqueSlug(title, async (slug) => {
      const existingProduct = await Product.findOne({ slug });
      return !!existingProduct;
    });
    
    const productData = {
      ...req.body,
      slug
    };
    
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error creating product'
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error updating product'
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Delete product files from S3 if they exist
    if (product.downloadFile && product.downloadFile.key) {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: product.downloadFile.key
      };
      
      try {
        await s3.deleteObject(deleteParams).promise();
        console.log(`Deleted file from S3: ${product.downloadFile.key}`);
      } catch (s3Error) {
        console.error('Error deleting file from S3:', s3Error);
        // Continue with product deletion even if file deletion fails
      }
    }
    
    // Delete product
    await product.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Upload product file to S3
 * @route   POST /api/products/:id/upload
 * @access  Private/Admin
 */
const uploadProductFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Prepare S3 upload parameters
    const fileKey = `products/${id}/${Date.now()}-${req.file.originalname}`;
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };
    
    // Upload file to S3
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Delete old file if it exists
    if (product.downloadFile && product.downloadFile.key) {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: product.downloadFile.key
      };
      
      try {
        await s3.deleteObject(deleteParams).promise();
        console.log(`Deleted old file from S3: ${product.downloadFile.key}`);
      } catch (s3Error) {
        console.error('Error deleting old file from S3:', s3Error);
        // Continue even if old file deletion fails
      }
    }
    
    // Update product with file info
    product.downloadFile = {
      key: fileKey,
      filename: req.file.originalname,
      size: req.file.size,
      contentType: req.file.mimetype
    };
    
    await product.save();
    
    res.json({
      success: true,
      data: {
        product,
        file: {
          key: fileKey,
          location: uploadResult.Location,
          filename: req.file.originalname,
          size: req.file.size,
          contentType: req.file.mimetype
        }
      }
    });
  } catch (error) {
    console.error('Error uploading product file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Generate a pre-signed download URL for a purchased product
 * @route   GET /api/products/:id/download
 * @access  Private (purchaser only)
 */
const getDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check if product has a download file
    if (!product.downloadFile || !product.downloadFile.key) {
      return res.status(404).json({
        success: false,
        error: 'Product has no downloadable file'
      });
    }
    
    // TODO: Check if user has purchased the product
    // For now, we'll skip this check since we don't have purchase tracking yet
    // In a real application, you would check if the current user has purchased this product
    
    // Generate pre-signed URL (valid for 5 minutes)
    const params = {
      Bucket: BUCKET_NAME,
      Key: product.downloadFile.key,
      Expires: 300, // 5 minutes
      ResponseContentDisposition: `attachment; filename="${product.downloadFile.filename}"`,
      ResponseContentType: product.downloadFile.contentType
    };
    
    const url = await s3.getSignedUrlPromise('getObject', params);
    
    // Increment download count
    product.downloads += 1;
    await product.save();
    
    res.json({
      success: true,
      data: {
        url,
        filename: product.downloadFile.filename,
        expires: 300 // seconds
      }
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductFile,
  getDownloadUrl
};