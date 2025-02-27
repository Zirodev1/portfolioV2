import { useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../components/sidebar.component';
import ProductCard from '../components/ProductCard';

const StorePage = () => {
  // Categories for filtering
  const categories = ['All', 'Templates', 'UI Kits', 'Notion', 'Framer', 'Figma'];
  const [activeCategory, setActiveCategory] = useState('All');

  // Sample products data
  const allProducts = [
    {
      id: "compo-portfolio",
      platform: "FRAMER",
      title: "Compo Portfolio Template",
      price: 69,
      description: "A minimal and professional portfolio template for designers and creatives.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Templates",
      featured: true,
      bestseller: true
    },
    {
      id: "capsule-blog",
      platform: "NOTION + SUPER",
      title: "Capsule Blog Template",
      price: 15,
      description: "A clean, customizable blog template powered by Notion and Super.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Notion",
      featured: true,
      bestseller: false
    },
    {
      id: "digital-dashboard",
      platform: "FIGMA",
      title: "Digital Dashboard UI Kit",
      price: 49,
      description: "A comprehensive UI kit for creating data-rich dashboard interfaces.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "UI Kits",
      featured: false,
      bestseller: true
    },
    {
      id: "minimal-portfolio",
      platform: "FRAMER",
      title: "Minimal Portfolio",
      price: 59,
      description: "A minimalist portfolio template with a focus on typography and whitespace.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Templates",
      featured: false,
      bestseller: false
    },
    {
      id: "agency-site",
      platform: "FRAMER",
      title: "Agency Site Template",
      price: 79,
      description: "A professional template for creative agencies featuring case studies and team showcases.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Templates",
      featured: false,
      bestseller: false
    },
    {
      id: "notion-productivity",
      platform: "NOTION",
      title: "Productivity System",
      price: 29,
      description: "A complete Notion system for personal and professional productivity management.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Notion",
      featured: false,
      bestseller: true
    },
    {
      id: "mobile-app-ui",
      platform: "FIGMA",
      title: "Mobile App UI Kit",
      price: 39,
      description: "A comprehensive mobile app UI kit with 100+ components and 50+ screens.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "UI Kits",
      featured: false,
      bestseller: false
    },
    {
      id: "ecommerce-template",
      platform: "FRAMER",
      title: "E-Commerce Template",
      price: 89,
      description: "A complete e-commerce template with product pages, cart functionality, and checkout.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Templates",
      featured: false,
      bestseller: false
    }
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === 'All' 
    ? allProducts 
    : allProducts.filter(product => 
        product.category === activeCategory || product.platform.includes(activeCategory.toUpperCase())
      );

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
          {allProducts.filter(p => p.featured).length > 0 && (
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
                    onClick={() => setActiveCategory('All')}
                    className="bg-white text-purple-900 hover:bg-gray-100 font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Explore All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                {product.bestseller && (
                  <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    BESTSELLER
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-300 mb-4">No products found in this category</h3>
              <button
                onClick={() => setActiveCategory('All')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                View All Products
              </button>
            </div>
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
                  After completing your purchase, you'll receive an email with download instructions. 
                  You can also access your purchases from your account dashboard at any time.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Do you offer refunds?</h3>
                <p className="text-gray-300">
                  Due to the digital nature of these products, I generally don't offer refunds. 
                  However, if you experience significant technical issues that I cannot resolve, 
                  please contact me, and I'll work with you to find a solution.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Do you provide support for your templates?</h3>
                <p className="text-gray-300">
                  Yes, I offer email support for all purchased products. Each product also comes with detailed documentation 
                  to help you get started. For more complex customizations, I'm available for hire on an hourly basis.
                </p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Can I use your templates for client projects?</h3>
                <p className="text-gray-300">
                  The standard license allows you to use a template for a single end product (your own or a client's). 
                  For multiple projects, you'll need to purchase a license for each use or contact me about an extended license.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;