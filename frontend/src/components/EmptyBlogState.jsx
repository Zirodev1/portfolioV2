import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * EmptyBlogState component displays a message when no blog posts are found
 * @param {Object} props Component props
 * @param {Function} props.onReset Function to reset filters
 * @param {String} props.message Custom message to display
 * @param {String} props.buttonText Text for the action button
 * @param {String} props.buttonLink Link for the action button (optional)
 * @returns {JSX.Element} Empty state UI component
 */
const EmptyBlogState = ({ 
  onReset, 
  message = "No articles found", 
  buttonText = "View All Articles",
  buttonLink = null
}) => {
  return (
    <div className="text-center py-16">
      <svg 
        className="w-16 h-16 mx-auto mb-4 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        ></path>
      </svg>
      <h3 className="text-xl text-gray-300 mb-4">{message}</h3>
      <p className="text-gray-400 mb-6">Try adjusting your search or filter to find what you're looking for</p>
      
      {buttonLink ? (
        <Link
          to={buttonLink}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          {buttonText}
        </Link>
      ) : (
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

EmptyBlogState.propTypes = {
  onReset: PropTypes.func,
  message: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string
};

export default EmptyBlogState; 