import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const BlogPostCard = ({ post }) => {
  const { slug, category, title, readTime, description, thumbnail, date } = post;
  
  return (
    <article className="flex flex-col md:flex-row bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.01]">
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
        <Link to={`/blog/${slug}`} className="block h-full">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      </div>
      <div className="md:w-2/3 p-6 flex flex-col">
        <div className="flex items-center mb-2">
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md mr-3">
            {category}
          </span>
          <span className="text-xs text-gray-400">{date}</span>
          <span className="mx-2 text-gray-500">•</span>
          <span className="text-xs text-gray-400">{readTime}</span>
        </div>
        <Link to={`/blog/${slug}`} className="block mb-4">
          <h2 className="text-xl font-bold hover:text-blue-400 transition-colors">
            {title}
          </h2>
        </Link>
        <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="mt-auto">
          <Link 
            to={`/blog/${slug}`} 
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            Read More
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

BlogPostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  }).isRequired
};

export default BlogPostCard;