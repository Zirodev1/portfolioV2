import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: { total: 0, published: 0 },
    projects: { total: 0, published: 0 },
    blogPosts: { total: 0, published: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // These endpoints don't exist yet - you'd need to create them for real stats
        // For now we'll just set placeholder stats
        setStats({
          products: { total: 5, published: 3 },
          projects: { total: 8, published: 6 },
          blogPosts: { total: 12, published: 10 }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminModules = [
    {
      title: 'Products',
      description: 'Manage your digital products, templates and downloadable assets',
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      stats: `${stats.products.published} published · ${stats.products.total - stats.products.published} drafts`,
      link: '/admin/products',
      color: 'bg-blue-900',
      buttonText: 'Manage Products'
    },
    {
      title: 'Portfolio Projects',
      description: 'Showcase your work experience and professional projects',
      icon: (
        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      stats: `${stats.projects.published} published · ${stats.projects.total - stats.projects.published} drafts`,
      link: '/admin/projects',
      color: 'bg-purple-900',
      buttonText: 'Manage Projects'
    },
    {
      title: 'Blog Posts',
      description: 'Create and manage your blog content',
      icon: (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      stats: `${stats.blogPosts.published} published · ${stats.blogPosts.total - stats.blogPosts.published} drafts`,
      link: '/admin/blog',
      color: 'bg-green-900',
      buttonText: 'Manage Blog'
    }
  ];

  const quickActions = [
    {
      text: 'New Product',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: '/admin/products/new'
    },
    {
      text: 'New Project',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: '/admin/projects/new'
    },
    {
      text: 'New Blog Post',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: '/admin/blog/new'
    }
  ];

  return (
    <AdminLayout title="Dashboard" activeMenu="dashboard">
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your portfolio, products, and content</p>
        </header>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex items-center bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                <span className="mr-2 text-blue-400">{action.icon}</span>
                {action.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <div
              key={index}
              className={`${module.color} bg-opacity-20 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-500 transition-colors`}
            >
              <div className="p-6">
                <div className="bg-black bg-opacity-30 rounded-full p-3 inline-block mb-4">
                  {module.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-400 mb-4">{module.description}</p>
                <div className="text-sm text-gray-500 mb-4">{module.stats}</div>
                <Link
                  to={module.link}
                  className="inline-block bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  {module.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 