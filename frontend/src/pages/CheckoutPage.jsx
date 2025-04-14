import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/sidebar.component';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    // For development/testing, we'll just show success
    setLoading(false);
  }, [sessionId]);
  
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
  
  if (error) {
    return (
      <div className="flex">
        <SideBar />
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="text-center max-w-xl px-6">
            <div className="mb-6 text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link 
              to="/store" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-block"
            >
              Return to Store
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
        <div className="p-10 md:p-16 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-6 text-green-500">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank you for your purchase!</h1>
            <p className="text-gray-400 mb-8">
              Your order has been successfully processed. You'll receive an email with your purchase details shortly.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 mb-10">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="mb-4 pb-4 border-b border-gray-700">
              <div className="flex items-start">
                <div className="flex-grow">
                  <h3 className="font-medium">Your digital product</h3>
                  <p className="text-gray-400 text-sm">Thank you for your purchase</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-medium">$69.00</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-medium mb-6">
              <span>Total:</span>
              <span>$69.00</span>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/store"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-gray-500 text-sm">
              If you have any questions about your order, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
