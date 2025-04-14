const Project = require('../models/Project');
const { generateUniqueSlug } = require('../utils/slugify');
const aws = require('../config/aws');
const s3 = aws.s3;
const BUCKET_NAME = process.env.AWS_BUCKET;

/**
 * @desc    Get all projects with filtering and sorting
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res) => {
  try {
    const { 
      category, 
      status, 
      featured, 
      limit = 10, 
      sort = 'displayOrder,asc',
      tags,
      technology
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category if provided
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // For public routes, only show published projects
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    } else if (status && status !== 'all') {
      // If admin and status filter provided
      query.status = status;
    }
    
    // Filter featured projects
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Filter by tag
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    // Filter by technology
    if (technology) {
      const techArray = technology.split(',');
      query.technologies = { $in: techArray };
    }
    
    console.log('Project query:', query);
    
    // Parse sort option
    const [sortField, sortOrder] = sort.split(',');
    const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };
    
    // Execute query
    const projects = await Project.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get a single project by slug
 * @route   GET /api/projects/:slug
 * @access  Public
 */
const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // For non-admin users, only show published projects
    const query = { slug };
    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    }
    
    const project = await Project.findOne(query);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/by-id/:id
 * @access  Private/Admin
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
const createProject = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Check required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, description, and category'
      });
    }
    
    // Generate slug if not provided
    const slug = req.body.slug || await generateUniqueSlug(title, async (slug) => {
      const existingProject = await Project.findOne({ slug });
      return !!existingProject;
    });
    
    const projectData = {
      ...req.body,
      slug
    };
    
    const project = await Project.create(projectData);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error creating project'
    });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find project
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error updating project'
    });
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find project
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Delete project images from S3 if they exist
    const imagesToDelete = [project.thumbnail, ...project.images].filter(Boolean);
    
    if (imagesToDelete.length > 0) {
      try {
        // Extract S3 keys from full URLs
        const keysToDelete = imagesToDelete.map(url => {
          // Extract key from URL (e.g., https://bucket.s3.region.amazonaws.com/key)
          const urlParts = url.split('/');
          return urlParts.slice(3).join('/'); // Get everything after the domain
        }).filter(Boolean);
        
        if (keysToDelete.length > 0) {
          // Delete in batches of 1000 (S3 limit)
          const deletePromises = [];
          for (let i = 0; i < keysToDelete.length; i += 1000) {
            const batch = keysToDelete.slice(i, i + 1000);
            deletePromises.push(
              s3.deleteObjects({
                Bucket: BUCKET_NAME,
                Delete: {
                  Objects: batch.map(Key => ({ Key }))
                }
              }).promise()
            );
          }
          
          await Promise.all(deletePromises);
          console.log(`Deleted ${keysToDelete.length} images from S3`);
        }
      } catch (s3Error) {
        console.error('Error deleting images from S3:', s3Error);
        // Continue with project deletion even if image deletion fails
      }
    }
    
    // Delete project
    await project.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Update project display order
 * @route   PUT /api/projects/reorder
 * @access  Private/Admin
 */
const updateProjectOrder = async (req, res) => {
  try {
    const { projects } = req.body;
    
    if (!projects || !Array.isArray(projects)) {
      return res.status(400).json({
        success: false,
        error: 'Projects array is required'
      });
    }
    
    // Validate structure of projects array
    const validStructure = projects.every(item => 
      item._id && (typeof item.displayOrder === 'number' || typeof item.order === 'number')
    );
    
    if (!validStructure) {
      return res.status(400).json({
        success: false,
        error: 'Each project must have _id and displayOrder/order fields'
      });
    }
    
    // Update each project's order
    const updatePromises = projects.map(project => {
      const order = project.displayOrder || project.order;
      return Project.findByIdAndUpdate(
        project._id,
        { displayOrder: order },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Project order updated successfully'
    });
  } catch (error) {
    console.error('Error updating project order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get unique tags and technologies for filtering
 * @route   GET /api/projects/filters
 * @access  Public
 */
const getProjectFilters = async (req, res) => {
  try {
    // Get unique categories
    const categories = await Project.distinct('category', {
      status: 'published'
    });
    
    // Get unique tags
    const tags = await Project.distinct('tags', {
      status: 'published'
    });
    
    // Get unique technologies
    const technologies = await Project.distinct('technologies', {
      status: 'published'
    });
    
    res.json({
      success: true,
      data: {
        categories,
        tags,
        technologies
      }
    });
  } catch (error) {
    console.error('Error fetching project filters:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectOrder,
  getProjectFilters
}; 