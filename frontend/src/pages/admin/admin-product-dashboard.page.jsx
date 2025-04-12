import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductListItem from '../../components/admin/products/ProductListItem';

const AdminProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare query parameters
      const params = {};
      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { params });
      console.log('Products response:', response.data);

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error loading products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev => {
      if (prev.includes(id)) {
        return prev.filter(productId => productId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productId}`);
        
        if (response.data.success) {
          // Remove product from state
          setProducts(products.filter(p => p._id !== productId));
          toast.success('Product deleted successfully!');
        } else {
          throw new Error(response.data.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product. Please try again.');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        // Use Promise.all to handle multiple delete requests in parallel
        const deletePromises = selectedProducts.map(id => 
          axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`)
        );
        
        await Promise.all(deletePromises);
        
        // Update state
        setProducts(products.filter(p => !selectedProducts.includes(p._id)));
        setSelectedProducts([]);
        
        toast.success(`${selectedProducts.length} products deleted successfully!`);
      } catch (error) {
        console.error('Error deleting products:', error);
        toast.error('Error deleting products. Please try again.');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.technologies && product.technologies.some(tech => tech.toLowerCase().includes(query)))
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Link
            to="/admin/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Add New Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'published' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'draft' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('draft')}
          >
            Drafts
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'archived' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived
          </button>
        </div>

        {/* Search and Bulk Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4 w-full md:w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm"
              >
                Delete Selected
              </button>
            )}
          </div>
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="bg-red-900 bg-opacity-25 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-md">
            <h3 className="text-xl text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : activeTab !== 'all' 
                  ? `No products in the "${activeTab}" category`
                  : 'Create your first product to get started'}
            </p>
            <Link
              to="/admin/products/new"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Add New Product
            </Link>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-600"
                      />
                    </th>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Downloads</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredProducts.map((product) => (
                    <ProductListItem
                      key={product._id}
                      product={product}
                      isSelected={selectedProducts.includes(product._id)}
                      onSelect={() => toggleSelectProduct(product._id)}
                      onDelete={() => handleDeleteProduct(product._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductDashboard;