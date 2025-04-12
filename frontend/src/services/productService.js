import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get all products with optional filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with products data
 */
export const getProducts = async (params = {}) => {
  try {
    const { data } = await axios.get(`${API_URL}/products`, { params });
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to fetch products. Please try again later.';
    throw new Error(errorMessage);
  }
};

/**
 * Get a single product by ID or slug
 * @param {string} idOrSlug - Product ID or slug
 * @returns {Promise} - Promise with product data
 */
export const getProduct = async (idOrSlug) => {
  try {
    const { data } = await axios.get(`${API_URL}/products/${idOrSlug}`);
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to fetch product. Please try again later.';
    throw new Error(errorMessage);
  }
};

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} - Promise with featured products data
 */
export const getFeaturedProducts = async (limit = 4) => {
  try {
    const { data } = await axios.get(`${API_URL}/products/featured`, { params: { limit } });
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to fetch featured products. Please try again later.';
    throw new Error(errorMessage);
  }
};

/**
 * Get bestseller products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} - Promise with bestseller products data
 */
export const getBestsellerProducts = async (limit = 4) => {
  try {
    const { data } = await axios.get(`${API_URL}/products/bestsellers`, { params: { limit } });
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to fetch bestseller products. Please try again later.';
    throw new Error(errorMessage);
  }
};

// Admin functions - these require authentication

/**
 * Create a new product (admin only)
 * @param {Object} productData - The product data
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with created product data
 */
export const createProduct = async (productData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${API_URL}/products`, productData, config);
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to create product. Please try again later.';
    throw new Error(errorMessage);
  }
};

/**
 * Update a product (admin only)
 * @param {string} id - Product ID
 * @param {Object} productData - The updated product data
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with updated product data
 */
export const updateProduct = async (id, productData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/products/${id}`, productData, config);
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to update product. Please try again later.';
    throw new Error(errorMessage);
  }
};

/**
 * Delete a product (admin only)
 * @param {string} id - Product ID
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with delete confirmation
 */
export const deleteProduct = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${API_URL}/products/${id}`, config);
    return data;
  } catch (error) {
    const errorMessage = 
      error.response?.data?.error || 
      'Failed to delete product. Please try again later.';
    throw new Error(errorMessage);
  }
};