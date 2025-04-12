import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../components/sidebar.component';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const StorePage = () => {


  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Pagination and filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');


  const [categories, setCategories] = useState(['All']);

   // Fetch products on initial load and when filters change
   useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Prepare query parameters
        const params = {
          page,
          limit: 9, // Products per page
          sort: 'createdAt,desc' // Newest first
        };
        
        // Apply category filter if not "All"
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        
        // Apply search filter if present
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        // Fetch products from API
        const response = await getProducts(params);
        
        setProducts(response.data);
        setTotalPages(response.pagination.totalPages);
        
        // Extract unique categories
        if (response.data.length > 0) {
          const uniqueCategories = [...new Set(response.data.map(product => product.category))];
          setCategories(['All', ...uniqueCategories]);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, activeCategory, searchTerm]);

  // Filter products based on active category
  const featuredProducts = products.filter(p => p.featured);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1); // Reset to first page when changing category
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is applied when form is submitted
    // The actual API call is triggered by the useEffect
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="w-full min-h-screen border-gray-700">
        <div className="p-10 md:p-16">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Store</h1>
            <p className="text-gray-400 text-lg max-w-3xl">
              Browse my collection of premium templates and digital products designed to help you create beautiful websites, 
              organize your workflow, and elevate your digital presence.
            </p>
          </div>

          {/* Featured Products Banner - Only show if there are featured products */}
          {featuredProducts.length > 0 && (
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 mb-12">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
                  <p className="text-gray-300 max-w-xl">
                    My most popular and highly-rated templates and resources.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button 
                    onClick={() => handleCategoryChange('All')}
                    className="bg-white text-purple-900 hover:bg-gray-100 font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Explore All
                  </button>
                </div>
              </div>
            </div>
          )}

           {/* Search and Filters */}
           <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="sm:flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

           {/* Loading, Error, and Empty States */}
           {loading ? (
            <div className="flex justify-center items-center p-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-200 p-4 rounded-md mb-8">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm underline hover:text-white"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 rounded-lg">
              <h3 className="text-xl text-gray-300 mb-4">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchTerm('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {products.map((product) => (
                  <div key={product._id} className="relative">
                    {product.bestseller && (
                      <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        BESTSELLER
                      </div>
                    )}
                    <ProductCard product={{
                      id: product._id,
                      platform: product.platform,
                      title: product.title,
                      price: product.price,
                      description: product.description,
                      thumbnail: product.thumbnail,
                      category: product.category
                    }} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mb-16">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-md ${
                        page === 1
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((x) => (
                      <button
                        key={x + 1}
                        onClick={() => handlePageChange(x + 1)}
                        className={`px-4 py-2 rounded-md ${
                          page === x + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        {x + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-md ${
                        page === totalPages
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Custom Work CTA */}
          <div className="bg-gray-800 rounded-xl p-8 mb-16">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Need Something Custom?</h2>
                <p className="text-gray-300 max-w-xl">
                  I also offer custom design services tailored to your specific needs.
                </p>
              </div>
              <div className="mt-6 md:mt-0">
                <Link
                  to="/contact"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors inline-block"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">How do I download my purchase?</h3>
                <p className="text-gray-300">
                  After completing your purchase, you&apos;ll receive an email with download instructions. 
                  You can also access your purchases from your account dashboard at any time.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Do you offer refunds?</h3>
                <p className="text-gray-300">
                  Due to the digital nature of these products, I generally don&apos;t offer refunds. 
                  However, if you experience significant technical issues that I cannot resolve, 
                  please contact me, and I&apos;ll work with you to find a solution.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Do you provide support for your templates?</h3>
                <p className="text-gray-300">
                  Yes, I offer email support for all purchased products. Each product also comes with detailed documentation 
                  to help you get started. For more complex customizations, I&apos;m available for hire on an hourly basis.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Can I use your templates for client projects?</h3>
                <p className="text-gray-300">
                  The standard license allows you to use a template for a single end product (your own or a client&apos;s). 
                  For multiple projects, you&apos;ll need to purchase a license for each use or contact me about an extended license.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StorePage;