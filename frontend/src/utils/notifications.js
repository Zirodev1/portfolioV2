import toast from 'react-hot-toast';

/**
 * Show a notification toast
 * @param {Object} options 
 * @param {string} options.type - success, error, or info
 * @param {string} options.message - The message to display
 * @param {number} options.duration - Duration in milliseconds (default: 4000)
 */
export const showNotification = ({ type = 'info', message, duration = 4000 }) => {
  const options = {
    duration,
    position: 'top-right',
    style: {
      background: '#1e1e1e', 
      color: '#fff',
      border: type === 'success' ? '1px solid #10B981' : 
              type === 'error' ? '1px solid #EF4444' : 
              '1px solid #0284c7'
    },
  };
  
  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
}; 