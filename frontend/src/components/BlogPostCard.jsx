import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const BlogPostCard = ({ post }) => {
  const { slug, category, title, readTime, description, thumbnail } = post;
  
  return (
    <Link to={`/blog/${slug}`} className="group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={thumbnail} 
              alt={`${title} thumbnail`} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="mb-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider">{category}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 mb-2">{readTime}</p>
          <p className="text-gray-300 hidden md:block">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

BlogPostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired
  }).isRequired
};

export default BlogPostCard;