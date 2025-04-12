import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const { _id, id, platform, title, price, description, thumbnail, slug } = product;

  // Create a consistent product URL using available identifiers in order of preference
  const productId = slug || _id || id;
  const productUrl = `/products/${productId}`;
  
  return (
    <div>
      <Link to={productUrl} className="block group">
        <div className="relative overflow-hidden rounded-md border border-gray-800 mb-4">
          {/* Product Thumbnail */}
          <img 
            src={thumbnail} 
            alt={`${title} thumbnail`} 
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <span className="bg-blue-600 text-white py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              View Details
            </span>
          </div>
        </div>
      </Link>
      <div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">{platform}</span>
            <h3 className="text-xl font-semibold mt-1 mb-1">{title}</h3>
          </div>
          <span className="text-xl font-medium">${price}</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {description}
        </p>
        <div className="flex space-x-3">
          <a 
            href="#" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors inline-block text-sm font-medium"
          >
            Buy Now
          </a>
          <Link 
            to={productUrl}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-4 rounded-md transition-colors inline-block text-sm font-medium"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired
  }).isRequired
};

export default ProductCard;