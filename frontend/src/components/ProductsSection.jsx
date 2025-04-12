import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductsSection = ({ products }) => {
  return (
    <section className="py-16 px-10 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-blue-400 hover:text-blue-300">
            View All Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.01]"
            >
              <Link to={`/products/${product.id}`} className="block flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="mb-1">
                    <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                      {product.platform}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${product.price}</span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                      Get Template
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

ProductsSection.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired
    })
  ).isRequired
};

export default ProductsSection;