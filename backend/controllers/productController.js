const Product = require('../models/Product');
const { generateUniqueSlug } = require('../utils/slugify');

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    // Prepare query
    let query = {};
    
    // Filter by category
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    
    // Filter by featured
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    
    // Filter by bestseller
    if (req.query.bestseller === 'true') {
      query.bestseller = true;
    }
    
    // Search by term
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    
    // Sorting
    let sortOptions = {};
    if (req.query.sort) {
      const sortField = req.query.sort.split(',')[0];
      const sortDirection = req.query.sort.split(',')[1] === 'desc' ? -1 : 1;
      sortOptions[sortField] = sortDirection;
    } else {
      // Default sort by newest
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit);
      
    // Get total count
    const totalProducts = await Product.countDocuments(query);
    
    // Pagination results
    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    };
    
    res.json({
      success: true,
      pagination,
      data: products,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

/**
 * @desc    Get a single product by ID or slug
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
const getProductByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product;
    
    // Check if the parameter is a valid MongoDB ID
    const isValidObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    
    if (isValidObjectId) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const { title, slug, price, description, category, platform, thumbnail } = req.body;
    
    // Check for required fields
    if (!title || !price || !description || !category || !platform || !thumbnail) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }
    
    // Generate unique slug if not provided
    const productSlug = slug || await generateUniqueSlug(title, async (slug) => {
      const existingProduct = await Product.findOne({ slug });
      return !!existingProduct;
    });
    
    // Create product
    const product = await Product.create({
      ...req.body,
      slug: productSlug,
    });
    
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    // If slug is being updated, ensure it's unique
    if (req.body.slug && req.body.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: req.body.slug });
      if (existingProduct) {
        res.status(400);
        throw new Error('Product with this slug already exists');
      }
    }
    
    // If title is changed but slug isn't provided, generate a new slug
    if (req.body.title && req.body.title !== product.title && !req.body.slug) {
      req.body.slug = await generateUniqueSlug(req.body.title, async (slug) => {
        const existingProduct = await Product.findOne({ slug });
        return !!existingProduct;
      });
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    await product.remove();
    
    res.json({
      success: true,
      data: {},
      message: 'Product removed'
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit);
      
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

/**
 * @desc    Get bestseller products
 * @route   GET /api/products/bestsellers
 * @access  Public
 */
const getBestsellerProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    
    const products = await Product.find({ bestseller: true })
      .sort({ createdAt: -1 })
      .limit(limit);
      
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500);
    throw error;
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestsellerProducts,
};