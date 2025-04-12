import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    salePrice: '',
    onSale: false,
    category: '',
    platform: '',
    featured: false,
    bestseller: false,
    thumbnail: '',
    images: [],
    technologies: [],
    features: [],
    status: 'draft',
    demoUrl: '',
    details: {
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      includes: [],
      features: []
    },
    faq: [{
      question: '',
      answer: ''
    }],
    testimonials: [{
      quote: '',
      author: '',
      role: ''
    }]
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', id);
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      // Use the by-id endpoint directly
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/by-id/${id}`);
      console.log('Product response:', response.data);

      if (response.data.success) {
        // Format the data for the form
        const productData = response.data.data;
        setFormData({
          ...productData,
          price: productData.price?.toString() || '',
          salePrice: productData.salePrice ? productData.salePrice.toString() : '',
          details: {
            ...productData.details,
            lastUpdated: productData.details?.lastUpdated 
              ? new Date(productData.details.lastUpdated).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
        });
      } else {
        console.error('API returned success: false', response.data);
        toast.error('Failed to fetch product data');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      toast.error('Error loading product data. Please check console for details.');
      setTimeout(() => navigate('/admin/products'), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., details.version)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle normal properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle array field changes (features, technologies, etc.)
  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Add new item to an array field
  const handleAddArrayItem = (field) => {
    setFormData(prev => {
      return { ...prev, [field]: [...prev[field], ''] };
    });
  };

  // Remove item from an array field
  const handleRemoveArrayItem = (index, field) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  // Handle complex object arrays (faq, testimonials)
  const handleObjectArrayChange = (e, index, field, subField) => {
    const { value } = e.target;
    
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [subField]: value };
      return { ...prev, [field]: newArray };
    });
  };

  // Add new item to complex object array
  const handleAddObjectArrayItem = (field, template) => {
    setFormData(prev => {
      return { ...prev, [field]: [...prev[field], template] };
    });
  };

  // Remove item from complex object array
  const handleRemoveObjectArrayItem = (index, field) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  // Handle thumbnail image upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          thumbnail: response.data.imageUrl
        }));
        toast.success('Thumbnail uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle product file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if we have a product ID first (for edit mode)
    if (!isEditMode && !formData._id) {
      toast.error('Please save the product first before uploading files');
      return;
    }

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    try {
      setUploadingFile(true);
      
      const targetId = formData._id || id;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/${targetId}/upload`,
        fileFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          downloadFile: response.data.data.product.downloadFile
        }));
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle gallery image upload
  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImage(true);

      // Upload each image
      const uploadPromises = files.map(file => {
        const imageFormData = new FormData();
        imageFormData.append('image', file);
        
        return axios.post(
          `${import.meta.env.VITE_API_URL}/upload/image`,
          imageFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      });

      const responses = await Promise.all(uploadPromises);
      
      // Get all image URLs
      const newImageUrls = responses.map(res => res.data.imageUrl).filter(Boolean);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));

      toast.success(`${newImageUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error('Failed to upload some or all gallery images');
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image from gallery
  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    // Validate price is a number
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }
    
    // Validate sale price if on sale
    if (formData.onSale) {
      if (!formData.salePrice.trim()) {
        newErrors.salePrice = 'Sale price is required when on sale';
      } else if (isNaN(parseFloat(formData.salePrice))) {
        newErrors.salePrice = 'Sale price must be a valid number';
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined
    };

    try {
      setSubmitting(true);
      
      let response;
      if (isEditMode) {
        // Update existing product
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${id}`,
          submitData
        );
      } else {
        // Create new product
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          submitData
        );
      }

      if (response.data.success) {
        toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
        
        // For new products, redirect to edit mode with the new ID
        if (!isEditMode) {
          navigate(`/admin/products/edit/${response.data.data._id}`);
        }
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Products" activeMenu="products">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products" activeMenu="products">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>

        <form onSubmit={e => e.preventDefault()} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  } rounded-md p-2`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1">Slug (leave empty for auto-generate)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  placeholder="your-product-name"
                />
              </div>
              
              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)*</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${
                    errors.price ? 'border-red-500' : 'border-gray-600'
                  } rounded-md p-2`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              
              {/* Sale Price & On Sale */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Sale Price ($)</label>
                  <input
                    type="text"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    disabled={!formData.onSale}
                    className={`w-full bg-gray-700 border ${
                      errors.salePrice ? 'border-red-500' : 'border-gray-600'
                    } rounded-md p-2 ${!formData.onSale ? 'opacity-50' : ''}`}
                  />
                  {errors.salePrice && <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>}
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="onSale"
                    name="onSale"
                    checked={formData.onSale}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-500"
                  />
                  <label htmlFor="onSale" className="ml-2 text-sm">On Sale</label>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${
                    errors.category ? 'border-red-500' : 'border-gray-600'
                  } rounded-md p-2`}
                >
                  <option value="">Select a category</option>
                  <option value="Website Template">Website Template</option>
                  <option value="React Component">React Component</option>
                  <option value="Full Stack App">Full Stack App</option>
                  <option value="UI Kit">UI Kit</option>
                  <option value="Plugin">Plugin</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
              
              {/* Platform */}
              <div>
                <label className="block text-sm font-medium mb-1">Platform/Tool*</label>
                <input
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${
                    errors.platform ? 'border-red-500' : 'border-gray-600'
                  } rounded-md p-2`}
                  placeholder="e.g. REACT, NEXTJS, FIGMA"
                />
                {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform}</p>}
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              {/* Demo URL */}
              <div>
                <label className="block text-sm font-medium mb-1">Demo URL</label>
                <input
                  type="text"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  placeholder="https://demo.example.com"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm">Feature this product</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bestseller"
                  name="bestseller"
                  checked={formData.bestseller}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-500"
                />
                <label htmlFor="bestseller" className="ml-2 text-sm">Mark as bestseller</label>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Short Description (max 200 characters)</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  rows="2"
                  maxLength="200"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Full Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full bg-gray-700 border ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  } rounded-md p-2`}
                  rows="6"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>
          
          {/* Media */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            
            {/* Thumbnail */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Main Thumbnail*</label>
              
              <div className="flex items-center space-x-4">
                {formData.thumbnail && (
                  <div className="w-32 h-32 overflow-hidden rounded-lg border border-gray-600">
                    <img 
                      src={formData.thumbnail} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500">
                    {uploadingImage ? (
                      <span className="text-sm text-gray-400">Uploading...</span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {formData.thumbnail ? 'Change thumbnail' : 'Upload thumbnail'}
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Gallery Images</label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 overflow-hidden rounded-lg border border-gray-600">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <label className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500">
                  {uploadingImage ? (
                    <span className="text-sm text-gray-400">Uploading...</span>
                  ) : (
                    <span className="text-sm text-gray-400">+ Add Image</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          
          {/* Product File */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Downloadable File</h2>
            
            <div>
              {formData.downloadFile?.key ? (
                <div className="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{formData.downloadFile.filename}</p>
                    <p className="text-xs text-gray-400">
                      {Math.round(formData.downloadFile.size / 1024)} KB • Uploaded successfully
                    </p>
                  </div>
                  <label className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm">
                    Replace
                    <input
                      type="file"
                      accept=".zip,.rar,.7z,.tar,.gz"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 text-center">
                    {uploadingFile ? (
                      <div className="text-gray-400">
                        <div className="animate-spin inline-block w-5 h-5 border-t-2 border-blue-500 rounded-full mb-2"></div>
                        <p>Uploading file...</p>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Drag and drop or click to upload</p>
                        <p className="text-xs mt-1">ZIP, RAR, or other archive formats (max 50MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".zip,.rar,.7z,.tar,.gz"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                  
                  {isEditMode === false && (
                    <p className="text-yellow-500 text-sm mt-2">
                      Note: You'll need to save the product first before uploading a file.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <button
                type="button"
                onClick={() => handleAddArrayItem('features')}
                className="text-blue-400 hover:text-blue-300"
              >
                + Add Feature
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange(e, index, 'features')}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="e.g. Responsive design that works on all devices"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, 'features')}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {formData.features.length === 0 && (
                <p className="text-gray-400 text-sm italic">No features added yet.</p>
              )}
            </div>
          </div>
          
          {/* Technologies */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Technologies</h2>
              <button
                type="button"
                onClick={() => handleAddArrayItem('technologies')}
                className="text-blue-400 hover:text-blue-300"
              >
                + Add Technology
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleArrayChange(e, index, 'technologies')}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, 'technologies')}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {formData.technologies.length === 0 && (
                <p className="text-gray-400 text-sm italic">No technologies added yet.</p>
              )}
            </div>
          </div>
          
          {/* FAQ */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">FAQ</h2>
              <button
                type="button"
                onClick={() => handleAddObjectArrayItem('faq', { question: '', answer: '' })}
                className="text-blue-400 hover:text-blue-300"
              >
                + Add FAQ Item
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.faq.map((item, index) => (
                <div key={index} className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">FAQ Item #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjectArrayItem(index, 'faq')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question</label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => handleObjectArrayChange(e, index, 'faq', 'question')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                        placeholder="e.g. Do I need coding knowledge to use this template?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Answer</label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => handleObjectArrayChange(e, index, 'faq', 'answer')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                        rows="3"
                        placeholder="Provide a clear and helpful answer"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.faq.length === 0 && (
                <p className="text-gray-400 text-sm italic">No FAQ items added yet.</p>
              )}
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Testimonials</h2>
              <button
                type="button"
                onClick={() => handleAddObjectArrayItem('testimonials', { quote: '', author: '', role: '' })}
                className="text-blue-400 hover:text-blue-300"
              >
                + Add Testimonial
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.testimonials.map((item, index) => (
                <div key={index} className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Testimonial #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveObjectArrayItem(index, 'testimonials')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quote</label>
                      <textarea
                        value={item.quote}
                        onChange={(e) => handleObjectArrayChange(e, index, 'testimonials', 'quote')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                        rows="3"
                        placeholder="The customer's testimonial quote"
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Author Name</label>
                        <input
                          type="text"
                          value={item.author}
                          onChange={(e) => handleObjectArrayChange(e, index, 'testimonials', 'author')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                          placeholder="e.g. John Smith"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Role/Company</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => handleObjectArrayChange(e, index, 'testimonials', 'role')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                          placeholder="e.g. Designer at Company"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.testimonials.length === 0 && (
                <p className="text-gray-400 text-sm italic">No testimonials added yet.</p>
              )}
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductFormPage; 