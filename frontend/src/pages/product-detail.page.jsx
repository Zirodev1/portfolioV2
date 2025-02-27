import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/sidebar.component";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // In a real application, you would fetch product data from an API or database
  // For now, we'll use dummy data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // This would be replaced with your actual data fetching
      const productData = {
        id: id,
        title: "Compo Portfolio Template",
        platform: "FRAMER",
        price: 69,
        description: "A minimal and professional portfolio template designed specifically for creatives, designers, and digital professionals looking to showcase their work in a clean, modern format.",
        thumbnail: "https://via.placeholder.com/600x400",
        category: "Templates",
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
          "Multiple portfolio layout options",
          "Contact form integration",
          "SEO optimized structure",
          "Clean, minimalist design aesthetic",
          "Dark and light mode options"
        ],
        includes: [
          "Framer template files",
          "Documentation and setup guide",
          "30 days of support",
          "Free updates",
          "Stock photos from preview (optional use)"
        ],
        mainImage: "https://via.placeholder.com/1200x800",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600"
        ],
        testimonials: [
          {
            quote: "This template saved me so much time! It was incredibly easy to customize and looks very professional.",
            author: "Alex Chen",
            role: "Graphic Designer"
          },
          {
            quote: "The attention to detail in this template is outstanding. I've received numerous compliments on my new portfolio.",
            author: "Sophia Williams",
            role: "UI/UX Designer"
          }
        ],
        faq: [
          {
            question: "Do I need coding knowledge to use this template?",
            answer: "No, the template is designed to be customized directly in Framer without requiring any coding knowledge. However, basic familiarity with Framer will be helpful."
          },
          {
            question: "Can I use this for client projects?",
            answer: "The standard license allows you to use this template for one end product (either for yourself or a client). For multiple projects, you'll need to purchase additional licenses."
          },
          {
            question: "What if I need help with customization?",
            answer: "The template comes with comprehensive documentation. If you need additional help, I offer support via email. For more extensive customizations, I'm available for hire at an hourly rate."
          }
        ],
        relatedProducts: [
          {
            id: "minimal-portfolio",
            title: "Minimal Portfolio",
            price: 59,
            thumbnail: "https://via.placeholder.com/300x200"
          },
          {
            id: "agency-site",
            title: "Agency Site Template",
            price: 79,
            thumbnail: "https://via.placeholder.com/300x200"
          },
          {
            id: "digital-dashboard",
            title: "Digital Dashboard UI Kit",
            price: 49,
            thumbnail: "https://via.placeholder.com/300x200"
          }
        ]
      };
      
      setProduct(productData);
      setLoading(false);
    }, 500);
  }, [id]);

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
            <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
                {product.images.map((image, index) => (
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
                  <a 
                    href="#" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors inline-block"
                  >
                    Buy Now
                  </a>
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
                {product.tags.map((tag, index) => (
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
                        {product.includes.map((item, index) => (
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
                    {product.features.map((feature, index) => (
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
                    {product.faq.map((item, index) => (
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
                    {product.testimonials.map((testimonial, index) => (
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
              {product.relatedProducts.map((related) => (
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
              <a 
                href="#" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors inline-block"
              >
                Buy Now for ${product.price}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;