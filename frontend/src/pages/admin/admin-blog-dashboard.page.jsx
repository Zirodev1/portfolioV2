import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import BlogPostList from '../../components/admin/blog/BlogPostList';
import BlogPostForm from '../../components/admin/blog/BlogPostForm';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminBlogDashboard = () => {
  const [activeView, setActiveView] = useState('list'); // list, create, edit
  const [selectedPost, setSelectedPost] = useState(null);
  const [notification, setNotification] = useState(null);

  // This data would come from your API in a real implementation
  const [posts, setPosts] = useState([
    {
      id: "1",
      slug: "building-scalable-nodejs-apis",
      title: "Building Scalable Node.js APIs with Express and MongoDB",
      content: "This is the full content of the post...",
      excerpt: "Learn how to architect and implement highly scalable RESTful APIs using Node.js, Express, and MongoDB with best practices for production.",
      category: "Backend",
      tags: ["Node.js", "Express", "MongoDB", "API Development", "Backend"],
      thumbnail: "https://via.placeholder.com/600x400",
      status: "published", // published, draft
      author: "Lee Acevedo",
      publishDate: "2023-10-12T00:00:00.000Z",
      lastUpdated: "2023-10-15T00:00:00.000Z",
      featured: true
    },
    {
      id: "2",
      slug: "react-performance-optimization",
      title: "React Performance Optimization Techniques",
      content: "This is the full content of the post...",
      excerpt: "Discover advanced strategies to optimize your React applications for better performance, including code-splitting, memoization, and virtualization.",
      category: "Frontend",
      tags: ["React", "Performance", "JavaScript", "Web Development"],
      thumbnail: "https://via.placeholder.com/600x400",
      status: "published",
      author: "Lee Acevedo",
      publishDate: "2023-09-28T00:00:00.000Z",
      lastUpdated: "2023-09-28T00:00:00.000Z",
      featured: true
    },
    {
      id: "3",
      slug: "typescript-best-practices",
      title: "TypeScript Best Practices for Large-Scale Applications",
      content: "This is the full content of the post...",
      excerpt: "Explore essential TypeScript patterns and practices that help maintain clean, scalable codebases in large enterprise applications.",
      category: "Web Development",
      tags: ["TypeScript", "JavaScript", "Best Practices", "Web Development"],
      thumbnail: "https://via.placeholder.com/600x400",
      status: "draft",
      author: "Lee Acevedo",
      publishDate: null,
      lastUpdated: "2023-08-15T00:00:00.000Z",
      featured: false
    }
  ]);

  const handleCreatePost = () => {
    setActiveView('create');
    setSelectedPost(null);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setActiveView('edit');
  };

  const handleDeletePost = (postId) => {
    // In a real implementation, this would call your API
    setPosts(posts.filter(post => post.id !== postId));
    
    // Show notification
    showNotification('Blog post deleted successfully');
  };

  const handlePostSubmit = (postData) => {
    if (activeView === 'edit') {
      // Update existing post
      setPosts(posts.map(p => 
        p.id === postData.id ? postData : p
      ));
      
      // Show notification
      showNotification('Blog post updated successfully');
    } else {
      // Add new post
      setPosts([...posts, postData]);
      
      // Show notification
      showNotification('Blog post created successfully');
    }
    
    // Go back to list view
    setActiveView('list');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedPost(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    
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
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {notification}
          </div>
        )}
        
        <div className="p-6">
          {activeView === 'list' && (
            <BlogPostList 
              posts={posts}
              onCreatePost={handleCreatePost}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
            />
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