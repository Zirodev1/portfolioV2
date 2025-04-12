import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BlogPostListItem = ({ post, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Format date for display, handling MongoDB date formats
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  // Add debugging for mongo ID
  useEffect(() => {
    if (!post._id && !post.id) {
      console.warn("Post missing ID:", post);
    }
  }, [post]);

  // Default values for missing properties
  const {
    title = 'Untitled Post',
    excerpt = '',
    category = 'Uncategorized',
    thumbnail = '',
    status = 'draft',
    slug = '',
    publishDate,
    lastUpdated,
    featured = false,
    _id,
    id,
    updatedAt,
    createdAt
  } = post;

  // Get stable ID to use for operations
  const postId = _id || id;

  // Local fallback image instead of placeholder.com
  const fallbackImage = '/assets/images/placeholder-blog.jpg';
  const imageSrc = imageError || !thumbnail ? fallbackImage : thumbnail;

  // Use MongoDB fields if legacy fields not available
  const lastUpdatedDate = lastUpdated || updatedAt || createdAt;
  const publishDateValue = publishDate || (status === 'published' ? createdAt : null);

  return (
    <tr>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-700">
            <img
              src={imageSrc}
              alt={title}
              className="h-full w-full object-cover object-center"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">{title}</div>
            <div className="text-sm text-gray-400 truncate max-w-xs">{excerpt}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          {category}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {formatDate(publishDateValue)}
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {formatDate(lastUpdatedDate)}
      </td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          {status === 'published' ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
              Published
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
              Draft
            </span>
          )}
          {featured && (
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
            {status === 'published' && slug && (
              <a 
                href={`/blog/${slug}`} 
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slug: PropTypes.string,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    category: PropTypes.string,
    status: PropTypes.string,
    thumbnail: PropTypes.string,
    publishDate: PropTypes.string,
    lastUpdated: PropTypes.string,
    featured: PropTypes.bool
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BlogPostListItem;