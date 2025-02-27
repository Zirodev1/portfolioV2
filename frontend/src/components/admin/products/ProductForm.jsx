import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductForm = ({ product, onSubmit }) => {
  // Default empty form state
  const defaultFormState = {
    id: '',
    title: '',
    price: '',
    description: '',
    category: '',
    platform: '',
    thumbnail: '',
    featured: false,
    bestseller: false
  };

  // Initialize form state from product or default
  const [formData, setFormData] = useState(product ? {
    ...product,
    price: product.price.toString() // Convert price to string for input field
  } : defaultFormState);

  // State for handling file uploads
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(product ? product.thumbnail : '');
  
  // State for form errors
  const [errors, setErrors] = useState({});
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories
  const categories = ['Templates', 'UI Kits', 'Notion', 'Framer', 'Figma'];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setThumbnailFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.thumbnail) {
      setErrors({
        ...errors,
        thumbnail: ''
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!thumbnailPreview && !formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail image is required';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would:
      // 1. Upload the image to cloud storage (S3, Cloudinary, etc.)
      // 2. Get the URL of the uploaded image
      // 3. Submit the form data with the image URL to your API
      
      // For now, we'll simulate this
      const imageUrl = thumbnailFile 
        ? thumbnailPreview // In a real app, this would be the URL from your cloud storage
        : formData.thumbnail;
      
      // Prepare final data
      const finalData = {
        ...formData,
        thumbnail: imageUrl,
        price: parseFloat(formData.price),
        lastUpdated: new Date().toISOString(),
        // Generate ID if new product
        id: formData.id || `product-${Date.now()}`
      };
      
      // Submit the data
      await onSubmit(finalData);
      
      // Reset form if it's a new product
      if (!product) {
        setFormData(defaultFormState);
        setThumbnailFile(null);
        setThumbnailPreview('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit product. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General error message */}
      {errors.submit && (
        <div className="bg-red-900 bg-opacity-50 text-red-200 px-4 py-3 rounded-md">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Product Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${
              errors.title ? 'border-red-500' : 'border-gray-600'
            } rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
            Price (USD) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">$</span>
            </div>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full bg-gray-700 border ${
                errors.price ? 'border-red-500' : 'border-gray-600'
              } rounded-md py-2 pl-7 pr-4 text-white focus:outline-none focus:border-blue-500`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full bg-gray-700 border ${
              errors.category ? 'border-red-500' : 'border-gray-600'
            } rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>
        
        {/* Platform */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-1">
            Platform/Tool *
          </label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            placeholder="e.g. FRAMER, NOTION + SUPER"
            className={`w-full bg-gray-700 border ${
              errors.platform ? 'border-red-500' : 'border-gray-600'
            } rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500`}
          />
          {errors.platform && (
            <p className="mt-1 text-sm text-red-500">{errors.platform}</p>
          )}
        </div>
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full bg-gray-700 border ${
            errors.description ? 'border-red-500' : 'border-gray-600'
          } rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      
      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Thumbnail Image *
        </label>
        <div className="flex items-start space-x-4">
          {/* Image preview */}
          {thumbnailPreview && (
            <div className="w-32 h-32 overflow-hidden rounded-md border border-gray-600">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-md hover:border-gray-500 transition-colors">
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm text-gray-400">
                  {thumbnailFile ? thumbnailFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF (max 2MB)</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Featured and Bestseller checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
            Mark as Featured Product
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="bestseller"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleChange}
            className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
          />
          <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-300">
            Mark as Bestseller
          </label>
        </div>
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    featured: PropTypes.bool,
    bestseller: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired
};

export default ProductForm;