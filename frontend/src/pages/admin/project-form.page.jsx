import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    client: '',
    completionDate: null,
    category: '',
    tags: [],
    technologies: [],
    featured: false,
    status: 'draft',
    thumbnail: '',
    images: [],
    liveUrl: '',
    githubUrl: '',
    challenge: '',
    solution: '',
    results: '',
    testimonial: {
      quote: '',
      author: '',
      position: '',
      company: ''
    },
    metaDescription: '',
    metaKeywords: ''
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Tags input state
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      console.log('Fetching project with ID:', id);
      
      // Use the by-id endpoint 
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/by-id/${id}`);
      
      if (response.data.success) {
        // Format the data for the form
        const projectData = response.data.data;
        setFormData({
          ...projectData,
          // Format date if it exists
          completionDate: projectData.completionDate ? new Date(projectData.completionDate) : null,
          // Ensure testimonial object exists
          testimonial: projectData.testimonial || {
            quote: '',
            author: '',
            position: '',
            company: ''
          }
        });
      } else {
        console.error('API returned success: false', response.data);
        toast.error('Failed to fetch project data');
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      toast.error('Error loading project data. Please check console for details.');
      setTimeout(() => navigate('/admin/projects'), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., testimonial.author)
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

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      completionDate: date
    }));
  };

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle technology input
  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()]
        }));
      }
      setTechInput('');
    }
  };

  // Remove technology
  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  // Handle thumbnail image upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      setUploadingImage(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/image`,
        imageFormData,
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
      } else if (response.data.imageUrl) {
        // Fallback for different response format
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
      const newImageUrls = responses.map(res => 
        res.data.imageUrl || (res.data.success && res.data.data ? res.data.data.imageUrl : null)
      ).filter(Boolean);

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
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail image is required';

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

    try {
      setSubmitting(true);
      
      let response;
      if (isEditMode) {
        // Update existing project
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/projects/${id}`,
          formData
        );
      } else {
        // Create new project
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/projects`,
          formData
        );
      }

      if (response.data.success) {
        toast.success(`Project ${isEditMode ? 'updated' : 'created'} successfully`);
        
        // For new projects, redirect to edit mode with the new ID
        if (!isEditMode && response.data.data._id) {
          navigate(`/admin/projects/edit/${response.data.data._id}`);
        } else {
          navigate('/admin/projects');
        }
      } else {
        throw new Error(response.data.error || 'Server returned an error');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} project`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Projects" activeMenu="projects">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Projects" activeMenu="projects">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
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
              {submitting ? 'Saving...' : 'Save Project'}
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
                <label className="block text-sm font-medium mb-1">Project Title*</label>
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
                  placeholder="your-project-name"
                />
              </div>
              
              {/* Client */}
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                />
              </div>
              
              {/* Completion Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Completion Date</label>
                <DatePicker
                  selected={formData.completionDate}
                  onChange={handleDateChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  placeholderText="Select month/year"
                />
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
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
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
            </div>
            
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm">Feature this project</label>
              </div>
            </div>
          </div>
          
          {/* URLs */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">External Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Live URL */}
              <div>
                <label className="block text-sm font-medium mb-1">Live Project URL</label>
                <input
                  type="text"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  placeholder="https://example.com"
                />
              </div>
              
              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium mb-1">GitHub Repository</label>
                <input
                  type="text"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  placeholder="https://github.com/username/repo"
                />
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
                  rows="5"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Challenge</label>
                <textarea
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  rows="3"
                  placeholder="Describe the challenges faced in this project"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  rows="3"
                  placeholder="Describe your solution approach"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Results</label>
                <textarea
                  name="results"
                  value={formData.results}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  rows="3"
                  placeholder="Describe the outcomes and results of the project"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Tags & Technologies */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tags & Technologies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="Add a tag and press Enter"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-300 hover:text-blue-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-gray-400 text-sm">No tags added yet</p>
                  )}
                </div>
              </div>
              
              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies Used</label>
                <div className="mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="Add a technology and press Enter"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="bg-purple-900 text-purple-200 px-2 py-1 rounded-full text-sm flex items-center">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 text-purple-300 hover:text-purple-100"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {formData.technologies.length === 0 && (
                    <p className="text-gray-400 text-sm">No technologies added yet</p>
                  )}
                </div>
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
                  {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
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
          
          {/* Testimonial */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Client Testimonial</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Testimonial Quote</label>
                <textarea
                  name="testimonial.quote"
                  value={formData.testimonial.quote}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  rows="3"
                  placeholder="What the client said about your work"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input
                    type="text"
                    name="testimonial.author"
                    value={formData.testimonial.author}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <input
                    type="text"
                    name="testimonial.position"
                    value={formData.testimonial.position}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="CEO"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    name="testimonial.company"
                    value={formData.testimonial.company}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                    placeholder="Company Name"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* SEO */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">SEO Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  rows="2"
                  maxLength="160"
                  placeholder="Brief description for search engines (max 160 characters)"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
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
              {submitting ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProjectFormPage; 