import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProductList from '../../components/admin/products/ProductList';
import ProductForm from '../../components/admin/products/ProductForm';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminProductDashboard = () => {
  const [activeView, setActiveView] = useState('list'); // list, create, edit
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);

  // This data would come from your API in a real implementation
  const [products, setProducts] = useState([
    {
      id: "compo-portfolio",
      platform: "FRAMER",
      title: "Compo Portfolio Template",
      price: 69,
      description: "A minimal and professional portfolio template for designers and creatives.",
      thumbnail: "https://via.placeholder.com/600x400",
      category: "Templates",
      featured: true,
      bestseller: true,
      createdAt: "2023-08-15T00:00:00.000Z",
      lastUpdated: "2023-10-01T00:00:00.000Z"
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
      bestseller: false,
      createdAt: "2023-07-20T00:00:00.000Z",
      lastUpdated: "2023-09-15T00:00:00.000Z"
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
      bestseller: true,
      createdAt: "2023-06-10T00:00:00.000Z",
      lastUpdated: "2023-08-22T00:00:00.000Z"
    }
  ]);

  const handleCreateProduct = () => {
    setActiveView('create');
    setSelectedProduct(null);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setActiveView('edit');
  };

  const handleDeleteProduct = (productId) => {
    // In a real implementation, this would call your API
    setProducts(products.filter(product => product.id !== productId));
    
    // Show notification
    showNotification('Product deleted successfully');
  };

  const handleProductSubmit = (productData) => {
    if (activeView === 'edit') {
      // Update existing product
      setProducts(products.map(p => 
        p.id === productData.id ? productData : p
      ));
      
      // Show notification
      showNotification('Product updated successfully');
    } else {
      // Add new product
      setProducts([...products, productData]);
      
      // Show notification
      showNotification('Product created successfully');
    }
    
    // Go back to list view
    setActiveView('list');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedProduct(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar activeMenu="products" />
      <div className="flex-1 overflow-auto">
        <AdminHeader title="Product Management" />
        
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
            {notification}
          </div>
        )}
        
        <div className="p-6">
          {activeView === 'list' && (
            <ProductList 
              products={products}
              onCreateProduct={handleCreateProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          
          {activeView === 'create' && (
            <div>
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Products
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
              <ProductForm onSubmit={handleProductSubmit} />
            </div>
          )}
          
          {activeView === 'edit' && selectedProduct && (
            <div>
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Products
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-6">Edit Product: {selectedProduct.title}</h2>
              <ProductForm product={selectedProduct} onSubmit={handleProductSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductDashboard;