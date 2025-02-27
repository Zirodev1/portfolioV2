import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import ProductCard from "./ProductCard";

const ProductsSection = ({ products }) => {
  return (
    <div className="p-10 md:p-16 pt-0">
      <h2 className="text-3xl font-bold mb-12">My Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* View All Products Button */}
      <div className="flex justify-center mb-16">
        <Link 
          to="/store" 
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-3 px-6 rounded-md transition-colors border border-gray-700 inline-block"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

ProductsSection.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ProductsSection;