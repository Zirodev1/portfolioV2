import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Send a contact form message
 * @param {Object} contactData - Contact form data
 * @returns {Promise} - Promise with contact submission result
 */
export const sendContactMessage = async (contactData) => {
  try {
    const { data } = await axios.post(`${API_URL}/contact`, contactData);
    return data;
  } catch (error) {
    // Extract error message from response if available
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Failed to send message. Please try again later.';
      
    throw new Error(errorMessage);
  }
};