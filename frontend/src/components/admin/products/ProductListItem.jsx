import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductListItem = ({ product, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
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
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">{product.title}</div>
            <div className="text-sm text-gray-400 truncate max-w-xs">{product.description}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="text-sm text-white">${product.price}</div>
      </td>
      <td className="py-4 px-4">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          {product.category}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {formatDate(product.lastUpdated)}
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col space-y-1">
          {product.featured && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">
              Featured
            </span>
          )}
          {product.bestseller && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
              Bestseller
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
          </div>
        )}
      </td>
    </tr>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    featured: PropTypes.bool,
    bestseller: PropTypes.bool,
    createdAt: PropTypes.string,
    lastUpdated: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ProductListItem;