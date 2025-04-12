import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductListItem = ({ product, isSelected, onSelect, onDelete }) => {
  console.log('Product in list item:', product._id, product.title);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <tr className="hover:bg-gray-750">
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product._id)}
          className="rounded border-gray-600"
        />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
            <img
              src={product.thumbnail || '/assets/images/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Link
              to={`/admin/products/edit/${product._id}`}
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              {product.title}
            </Link>
            {product.featured && (
              <span className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded ml-2">
                Featured
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-300">{product.category}</td>
      <td className="py-3 px-4 text-gray-300">
        {product.onSale && product.salePrice ? (
          <div>
            <span className="line-through text-gray-500 mr-2">
              {formatPrice(product.price)}
            </span>
            <span className="text-green-400">{formatPrice(product.salePrice)}</span>
          </div>
        ) : (
          formatPrice(product.price)
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(product.status)}`}>
          {product.status}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-300">{product.downloads || 0}</td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/products/edit/${product._id}`}
            className="text-blue-400 hover:text-blue-300"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="text-red-400 hover:text-red-300"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <Link
            to={`/admin/products/edit/${product._id}#files`}
            className="text-green-400 hover:text-green-300"
            title="Manage Files"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </Link>
          <Link
            to={`/products/${product.slug}`}
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
  );
};

ProductListItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    onSale: PropTypes.bool,
    category: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    status: PropTypes.string,
    featured: PropTypes.bool,
    downloads: PropTypes.number
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ProductListItem;