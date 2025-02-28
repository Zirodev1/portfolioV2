import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BlogPostForm = ({ post, onSubmit }) => {
  // Available categories
  const categories = ['Web Development', 'Frontend', 'Backend', 'DevOps', 'Tutorials', 'Career'];
  
  // Default empty form state
  const defaultFormState = {
    id: '',
    slug: '',
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    thumbnail: '',
    status: 'draft', // draft, published
    publishDate: '',
    featured: false
  };

  // Initialize form state from post or default
  const [formData, setFormData] = useState(post ? {
    ...post,
    tags: post.tags.join(', ') // Convert tags array to comma-separated string for input
  } : defaultFormState);

  // State for handling file uploads
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(post ? post.thumbnail : '');
  
  // State for form errors
  const [errors, setErrors] = useState({});
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for tag input
  const [tagInput, setTagInput] = useState(post ? post.tags.join(', ') : '');

  // For a real implementation, you would use a rich text editor
  // This is a simplified version
  const [contentPreview, setContentPreview] = useState(false);

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

  // Handle tag input
  const handleTagChange = (e) => {
    setTagInput(e.target.value);
    
    // Update form data with parsed tags
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFormData({
      ...formData,
      tags
    });
  };

  // Handle slug generation from title
  useEffect(() => {
    if (!post && formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setFormData({
        ...formData,
        slug
      });
    }
  }, [formData.title, post]);

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

  // Handle status change with publish date logic
  const handleStatusChange = (e) => {
    const status = e.target.value;
    
    // If changing to published and no publish date is set, use current date
    if (status === 'published' && !formData.publishDate) {
      setFormData({
        ...formData,
        status,
        publishDate: new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        ...formData,
        status
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
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
      
      // Prepare tags array
      const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      // Prepare final data
      const finalData = {
        ...formData,
        tags,
        thumbnail: imageUrl,
        lastUpdated: new Date().toISOString(),
        // Generate ID if new post
        id: formData.id || `post-${Date.now()}`
      };
      
      // Submit the data
      await onSubmit(finalData);
      
      // Reset form if it's a new post
      if (!post) {
        setFormData(defaultFormState);
        setThumbnailFile(null);
        setThumbnailPreview('');
        setTagInput('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        submit: 'Failed to submit post. Please try again.'
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
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title *
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
        
        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
            Slug *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-800 text-gray-400 text-sm">
              /blog/
            </span>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`flex-1 min-w-0 block w-full bg-gray-700 border ${
                errors.slug ? 'border-red-500' : 'border-gray-600'
              } rounded-r-md py-2 px-4 text-white focus:outline-none focus:border-blue-500`}
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
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
      </div>
      
      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-1">
          Excerpt * <span className="text-gray-500">(Short summary for previews)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className={`w-full bg-gray-700 border ${
            errors.excerpt ? 'border-red-500' : 'border-gray-600'
          } rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500`}
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
        )}
      </div>
      
      {/* Content */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-gray-300">
            Content *
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`text-sm px-3 py-1 rounded ${contentPreview ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              onClick={() => setContentPreview(false)}
            >
              Write
            </button>
            <button
              type="button"
              className={`text-sm px-3 py-1 rounded ${contentPreview ? 'bg-gray-800 text-gray-400' : 'bg-gray-600 text-white'}`}
              onClick={() => setContentPreview(true)}
            >
              Preview
            </button>
          </div>
        </div>
        
        {contentPreview ? (
          <div className="prose prose-invert prose-lg max-w-none bg-gray-800 border border-gray-700 rounded-md p-6 min-h-[400px] overflow-auto">
            {/* This would be a proper markdown renderer in a real app */}
            <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br />') }} />
          </div>
        ) : (
          <>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              placeholder="Write your content in markdown format..."
              className={`w-full bg-gray-700 border ${
                errors.content ? 'border-red-500' : 'border-gray-600'
              } rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500 font-mono`}
            />
            <p className="mt-1 text-xs text-gray-400">
              Use markdown for formatting. Example: # Heading, **bold**, *italic*, [link](url), etc.
            </p>
          </>
        )}
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>
      
      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
          Tags <span className="text-gray-500">(Comma separated)</span>
        </label>
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={handleTagChange}
          placeholder="React, JavaScript, Web Development"
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500"
        />
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
      
      {/* Publication Settings */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Publication Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleStatusChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          {/* Publish Date - Only show if status is published */}
          {formData.status === 'published' && (
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-300 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          
          {/* Featured */}
          <div className="md:col-span-2">
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
                Feature this post on the blog homepage
              </label>
            </div>
          </div>
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
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

BlogPostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    thumbnail: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    publishDate: PropTypes.string,
    lastUpdated: PropTypes.string,
    featured: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired
};

export default BlogPostForm;