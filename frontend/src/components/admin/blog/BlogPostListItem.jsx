import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogPostListItem = ({ post, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <tr>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">{post.title}</div>
            <div className="text-sm text-gray-400 truncate max-w-xs">{post.excerpt}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          {post.category}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {formatDate(post.publishDate)}
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {formatDate(post.lastUpdated)}
      </td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          {post.status === 'published' ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
              Published
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
              Draft
            </span>
          )}
          {post.featured && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">
              Featured
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-right text-sm font-medium">
        {showDeleteConfirm ? (
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-400"
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onEdit}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-400"
            >
              Delete
            </button>
            {post.status === 'published' && (
              <a 
                href={`/blog/${post.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                View
              </a>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

BlogPostListItem.propTypes = {
  post: PropTypes.shape({
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
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BlogPostListItem;