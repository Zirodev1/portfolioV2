import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdminProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare query parameters
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, { params });
      console.log('Projects response:', response.data);

      if (response.data.success) {
        setProjects(response.data.data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error loading projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectProject = (id) => {
    setSelectedProjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(projectId => projectId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p._id));
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${projectId}`);
        
        if (response.data.success) {
          // Remove project from state
          setProjects(projects.filter(p => p._id !== projectId));
          toast.success('Project deleted successfully!');
        } else {
          throw new Error(response.data.error || 'Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Error deleting project. Please try again.');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProjects.length} projects?`)) {
      try {
        // Use Promise.all to handle multiple delete requests in parallel
        const deletePromises = selectedProjects.map(id => 
          axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`)
        );
        
        await Promise.all(deletePromises);
        
        // Update state
        setProjects(projects.filter(p => !selectedProjects.includes(p._id)));
        setSelectedProjects([]);
        
        toast.success(`${selectedProjects.length} projects deleted successfully!`);
      } catch (error) {
        console.error('Error deleting projects:', error);
        toast.error('Error deleting projects. Please try again.');
      }
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredProjects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update display order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index
    }));
    
    setProjects(prev => {
      // Replace the filtered items in the main projects array
      const newProjects = [...prev];
      updatedItems.forEach(updatedItem => {
        const index = newProjects.findIndex(p => p._id === updatedItem._id);
        if (index !== -1) {
          newProjects[index] = updatedItem;
        }
      });
      return newProjects;
    });
    
    // Save order to the backend
    try {
      setReordering(true);
      
      const projectsToUpdate = updatedItems.map(p => ({
        _id: p._id,
        displayOrder: p.displayOrder
      }));
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/reorder`,
        { projects: projectsToUpdate }
      );
      
      if (response.data.success) {
        toast.success('Project order updated successfully');
      }
    } catch (error) {
      console.error('Error updating project order:', error);
      toast.error('Failed to save new project order');
    } finally {
      setReordering(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      (project.technologies && project.technologies.some(tech => tech.toLowerCase().includes(query))) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-900 text-green-300';
      case 'draft':
        return 'bg-yellow-900 text-yellow-300';
      case 'archived':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-blue-900 text-blue-300';
    }
  };

  return (
    <AdminLayout title="Projects" activeMenu="projects">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Portfolio Project Management</h1>
          <Link
            to="/admin/projects/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Add New Project
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'published' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'draft' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('draft')}
          >
            Drafts
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'archived' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived
          </button>
        </div>

        {/* Search and Bulk Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4 w-full md:w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {selectedProjects.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm"
              >
                Delete Selected
              </button>
            )}
          </div>
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="bg-red-900 bg-opacity-25 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-md">
            <h3 className="text-xl text-gray-300 mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : activeTab !== 'all' 
                  ? `No projects in the "${activeTab}" category`
                  : 'Create your first project to get started'}
            </p>
            <Link
              to="/admin/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Add New Project
            </Link>
          </div>
        ) : (
          <>
            {/* Projects Table */}
            <div className="overflow-x-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="projects">
                  {(provided) => (
                    <table 
                      className="min-w-full bg-gray-800 rounded-lg overflow-hidden" 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="py-3 px-4 text-left">
                            <input
                              type="checkbox"
                              checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-600"
                            />
                          </th>
                          <th className="py-3 px-4 text-left">Order</th>
                          <th className="py-3 px-4 text-left">Project</th>
                          <th className="py-3 px-4 text-left">Category</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {filteredProjects.map((project, index) => (
                          <Draggable 
                            key={project._id} 
                            draggableId={project._id} 
                            index={index}
                            isDragDisabled={reordering}
                          >
                            {(provided) => (
                              <tr 
                                className="hover:bg-gray-750"
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(project._id)}
                                    onChange={() => toggleSelectProject(project._id)}
                                    className="rounded border-gray-600"
                                  />
                                </td>
                                <td className="py-3 px-4" {...provided.dragHandleProps}>
                                  <div className="flex items-center">
                                    <span className="mr-2">{project.displayOrder || index + 1}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                      <img
                                        src={project.thumbnail || '/assets/placeholder-project.jpg'}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <Link
                                        to={`/admin/projects/edit/${project._id}`}
                                        className="font-medium text-blue-400 hover:text-blue-300"
                                      >
                                        {project.title}
                                      </Link>
                                      {project.featured && (
                                        <span className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded ml-2">
                                          Featured
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-300">{project.category}</td>
                                <td className="py-3 px-4">
                                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(project.status)}`}>
                                    {project.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Link
                                      to={`/admin/projects/edit/${project._id}`}
                                      className="text-blue-400 hover:text-blue-300"
                                      title="Edit"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </Link>
                                    <button
                                      onClick={() => handleDeleteProject(project._id)}
                                      className="text-red-400 hover:text-red-300"
                                      title="Delete"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                    <Link
                                      to={`/project/${project.slug}`}
                                      target="_blank"
                                      className="text-gray-400 hover:text-gray-300"
                                      title="View"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjectDashboard; 