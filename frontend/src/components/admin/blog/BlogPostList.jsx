import { useState } from 'react';
import PropTypes from 'prop-types';
import BlogPostListItem from './BlogPostListItem';

const BlogPostList = ({ posts, onCreatePost, onEditPost, onDeletePost }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Get unique categories from posts
  const categories = ['All', ...new Set(posts.map(post => post.category))];

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      // Filter by search term
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      
      // Filter by category
      const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      // Handle different sort fields
      let valueA, valueB;
      
      if (sortField === 'title') {
        valueA = a.title;
        valueB = b.title;
      } else if (sortField === 'publishDate') {
        // Handle null publish dates (drafts)
        valueA = a.publishDate ? new Date(a.publishDate) : new Date(0);
        valueB = b.publishDate ? new Date(b.publishDate) : new Date(0);
      } else {
        // Default to lastUpdated
        valueA = new Date(a.lastUpdated);
        valueB = new Date(b.lastUpdated);
      }
      
      // Sort based on direction
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and reset direction to desc
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts ({filteredPosts.length})</h2>
        <button
          onClick={onCreatePost}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Blog Post
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 pr-10 text-gray-300 focus:outline-none focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-300 focus:outline-none focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    <span>Title</span>
                    {sortField === 'title' && (
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {sortDirection === 'asc' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('publishDate')}
                >
                  <div className="flex items-center">
                    <span>Published</span>
                    {sortField === 'publishDate' && (
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {sortDirection === 'asc' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastUpdated')}
                >
                  <div className="flex items-center">
                    <span>Updated</span>
                    {sortField === 'lastUpdated' && (
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {sortDirection === 'asc' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPosts.map(post => (
                <BlogPostListItem 
                  key={post.id}
                  post={post}
                  onEdit={() => onEditPost(post)}
                  onDelete={() => onDeletePost(post.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No blog posts found</p>
          <button
            onClick={onCreatePost}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Create Your First Blog Post
          </button>
        </div>
      )}
    </div>
  );
};

BlogPostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      publishDate: PropTypes.string,
      lastUpdated: PropTypes.string,
      featured: PropTypes.bool
    })
  ).isRequired,
  onCreatePost: PropTypes.func.isRequired,
  onEditPost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired
};

export default BlogPostList;