import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import BlogPostList from '../../components/admin/blog/BlogPostList';
import BlogPostForm from '../../components/admin/blog/BlogPostForm';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminBlogDashboard = () => {
  const [activeView, setActiveView] = useState('list'); // list, create, edit
  const [selectedPost, setSelectedPost] = useState(null);
  const [notification, setNotification] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog posts from API
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching blog posts from API...");
      console.log("API URL:", import.meta.env.VITE_API_URL);
      
      // Use the test endpoint that bypasses authentication
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/test-all`);
      
      console.log('Fetched blog posts response:', response);
      
      if (response.data.success) {
        console.log(`Successfully fetched ${response.data.count} blog posts`);
        setPosts(response.data.data);
      } else {
        console.error("API returned success: false", response.data);
        setError('Failed to fetch blog posts: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Error fetching blog posts. Please try again. ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setActiveView('create');
    setSelectedPost(null);
  };

  const handleEditPost = (post) => {
    console.log('Editing post:', post);
    setSelectedPost(post);
    setActiveView('edit');
  };

  const handleDeletePost = async (postId) => {
    if (!postId) {
      console.error("Missing post ID for deletion");
      showNotification({
        type: 'error',
        message: 'Cannot delete post: missing ID'
      });
      return;
    }

    console.log("Attempting to delete post with ID:", postId);
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // First update local state for immediate UI feedback
        setPosts(posts.filter(p => (p.id !== postId && p._id !== postId)));
        
        // Then delete from the server
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/blog/${postId}`);
        
        console.log("Delete response:", response.data);
        
        if (response.data.success) {
          showNotification({
            type: 'success',
            message: 'Blog post deleted successfully!'
          });
        } else {
          // If server delete fails, revert the local state change
          console.error("Delete API returned success: false", response.data);
          await fetchBlogPosts();
          showNotification({
            type: 'error',
            message: 'Failed to delete blog post: ' + (response.data.error || 'Unknown error')
          });
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        // If server delete fails, revert the local state change
        await fetchBlogPosts();
        showNotification({
          type: 'error',
          message: 'Error deleting blog post: ' + (error.message || 'Unknown error')
        });
      }
    }
  };

  const handlePostSubmit = async (blogData) => {
    console.log('Submitting blog post:', blogData);
    
    try {
      // Generate a slug from title if not provided
      let slug = blogData.slug;
      if (!slug && blogData.title) {
        slug = blogData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-'); // Replace multiple hyphens with single
      }
      
      // Normalize blog data
      const normalizedData = {
        ...blogData,
        slug: slug || `post-${Date.now()}`,
        category: blogData.category || 'Web Development',
      };
      
      let response;
      
      if (blogData.id || blogData._id) {
        // Update existing post
        const postId = blogData.id || blogData._id;
        response = await axios.put(`${import.meta.env.VITE_API_URL}/blog/${postId}`, normalizedData);
      } else {
        // Create new post
        response = await axios.post(`${import.meta.env.VITE_API_URL}/blog`, normalizedData);
      }
      
      console.log('Server response:', response.data);
      
      if (response.data.success) {
        // Refresh posts list from server to get the updated data
        await fetchBlogPosts();
        
        setActiveView('list');
        showNotification({
          type: 'success',
          message: blogData.id || blogData._id
            ? 'Blog post updated successfully!'
            : 'Blog post created successfully!'
        });
      } else {
        showNotification({
          type: 'error',
          message: 'Failed to save blog post'
        });
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      showNotification({
        type: 'error',
        message: 'Error saving blog post. Please try again.'
      });
    }
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedPost(null);
  };

  const showNotification = (message) => {
    // Convert string messages to object format for consistency
    if (typeof message === 'string') {
      setNotification({
        type: 'success',
        message: message
      });
    } else {
      setNotification(message);
    }
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar activeMenu="blog" />
      <div className="flex-1 overflow-auto">
        <AdminHeader title="Blog Management" />
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          } text-white`}>
            {typeof notification === 'string' ? notification : notification.message}
          </div>
        )}
        
        <div className="p-6">
          {activeView === 'list' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-600 text-white p-4 rounded-md mb-4">
                  {error}
                  <button 
                    onClick={fetchBlogPosts}
                    className="ml-4 bg-white text-red-600 px-3 py-1 rounded-md text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <BlogPostList 
                  posts={posts}
                  onCreatePost={handleCreatePost}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              )}
            </>
          )}
          
          {activeView === 'create' && (
            <div>
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Posts
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
              <BlogPostForm onSubmit={handlePostSubmit} />
            </div>
          )}
          
          {activeView === 'edit' && selectedPost && (
            <div>
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Posts
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-6">Edit Blog Post: {selectedPost.title}</h2>
              <BlogPostForm post={selectedPost} onSubmit={handlePostSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlogDashboard;