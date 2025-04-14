import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/sidebar.component";
import API from "../api/config";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try by slug
        console.log(`Fetching product with slug/id: ${id}`);
        let response = await API.get(`/api/products/${id}`);
        
        // If not found by slug, try by ID
        if (!response.data.success) {
          console.log(`Not found by slug, trying by ID: ${id}`);
          response = await API.get(`/api/products/by-id/${id}`);
        }
        
        if (response.data.success) {
          console.log('Product data received:', response.data.data);
          setProduct(response.data.data);
        } else {
          console.error('Failed to fetch product:', response.data.error);
          setError('Product could not be loaded');
          // Use fallback data if API call fails
          setFallbackProductData();
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product');
        // Use fallback data if API call fails
        setFallbackProductData();
      } finally {
        setLoading(false);
      }
    };

    const setFallbackProductData = () => {
      // Fallback dummy data
      setProduct({
        id: id,
        title: "Compo Portfolio Template",
        platform: "FRAMER",
        price: 69,
        description: "A minimal and professional portfolio template designed specifically for creatives, designers, and digital professionals looking to showcase their work in a clean, modern format.",
        thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        mainImage: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Website Template",
        featured: true,
        bestseller: true,
        preview: "https://example.com/preview",
        lastUpdated: "August 15, 2023",
        version: "2.1",
        tags: ["Portfolio", "Creative", "Minimal", "Responsive", "Framer"],
        features: [
          "Responsive design that works on all devices",
          "Easy-to-customize sections and components",
          "Built with modern Framer features",
          "Multiple portfolio layout options"
        ],
        includes: [
          "Framer template files",
          "Documentation and setup guide",
          "30 days of support",
          "Free updates"
        ],
        images: [
          "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ]
      });
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    try {
      const response = await API.post('/api/payments/create-checkout-session', {
        productId: product._id || product.id // Use _id for real products, fallback to id for dummy data
      });
      
      if (response.data.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.data.url;
      } else {
        console.error('Failed to create checkout session:', response.data.error);
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to process your request. Please try again later.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <SideBar />
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex">
        <SideBar />
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-400 mb-6">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Link 
              to="/store" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="w-full min-h-screen">
        <div className="p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Images */}
            <div>
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src={product.mainImage} 
                  alt={product.title} 
                  className="w-full h-auto"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images && product.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden cursor-pointer">
                    <img 
                      src={image} 
                      alt={`${product.title} - Preview ${index + 1}`} 
                      className="w-full h-24 object-cover hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-blue-400 font-medium">{product.platform}</span>
                {product.bestseller && (
                  <span className="ml-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    BESTSELLER
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{product.title}</h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center mb-8">
                <span className="text-3xl font-bold">${product.price}</span>
                <div className="ml-6">
                  <button 
                    onClick={handleBuyNow}
                    disabled={isCheckingOut}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors inline-block ${
                      isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isCheckingOut ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
                <div className="ml-3">
                  <a 
                    href={product.preview} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-block"
                  >
                    Live Preview
                  </a>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Category</p>
                    <p className="text-gray-200">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                    <p className="text-gray-200">{product.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Version</p>
                    <p className="text-gray-200">{product.version}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags && product.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-16">
            <div className="border-b border-gray-700 mb-8">
              <div className="flex flex-wrap -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`inline-block py-4 px-6 text-center border-b-2 font-medium text-lg ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`inline-block py-4 px-6 text-center border-b-2 font-medium text-lg ${
                    activeTab === 'features'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`inline-block py-4 px-6 text-center border-b-2 font-medium text-lg ${
                    activeTab === 'faq'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`inline-block py-4 px-6 text-center border-b-2 font-medium text-lg ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Overview */}
              {activeTab === 'overview' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-xl font-bold mb-6">Description</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {product.description}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        This template is perfect for creatives, designers, and professionals looking 
                        to showcase their portfolio in a clean, modern way. With a focus on visual 
                        presentation and ease of use, this template allows you to highlight your 
                        work effectively and create a strong online presence.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-6">What's Included</h3>
                      <ul className="space-y-3">
                        {product.includes && product.includes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              {activeTab === 'features' && (
                <div>
                  <h3 className="text-xl font-bold mb-8">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.features && product.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {activeTab === 'faq' && (
                <div>
                  <h3 className="text-xl font-bold mb-8">Frequently Asked Questions</h3>
                  <div className="space-y-6">
                    {product.faq && product.faq.map((item, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-6">
                        <h4 className="text-lg font-medium mb-3">{item.question}</h4>
                        <p className="text-gray-300">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold mb-8">Customer Reviews</h3>
                  <div className="space-y-8">
                    {product.testimonials && product.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                        <div className="text-gray-400">
                          <p className="font-medium text-white">{testimonial.author}</p>
                          <p className="text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.relatedProducts && product.relatedProducts.map((related) => (
                <div key={related.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <Link to={`/products/${related.id}`} className="block">
                    <img 
                      src={related.thumbnail} 
                      alt={related.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-medium mb-1">{related.title}</h4>
                      <p className="text-blue-400">${related.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-8 mb-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to upgrade your online presence?</h2>
              <p className="text-gray-300 mb-6">
                Get started with {product.title} today and create a stunning portfolio that stands out.
              </p>
              <button 
                onClick={handleBuyNow}
                disabled={isCheckingOut}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors inline-block ${
                  isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isCheckingOut ? 'Processing...' : `Buy Now for $${product.price}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;