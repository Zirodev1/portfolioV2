const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  getProjects, 
  getProjectBySlug, 
  getProjectById,
  createProject, 
  updateProject, 
  deleteProject,
  updateProjectOrder,
  getProjectFilters
} = require('../controllers/projectController');

// Public routes
router.get('/', getProjects);
router.get('/filters', getProjectFilters);
router.get('/by-id/:id', getProjectById);
router.get('/:slug', getProjectBySlug);

// Admin routes
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.put('/reorder', updateProjectOrder);

module.exports = router; 