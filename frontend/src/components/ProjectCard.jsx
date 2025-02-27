import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ProjectCard = ({ project }) => {
  const { id, category, title, description, thumbnail, accentColor } = project;
  
  return (
    <div className=" rounded-lg overflow-hidden flex flex-col">
      <Link to={`/project/${id}`} className="block overflow-hidden h-48 relative">
        <div 
          className={`absolute inset-0 bg-${accentColor}-600 opacity-20 z-10 hover:opacity-0 transition-opacity duration-300`}
        ></div>
        <div className="w-full h-full overflow-hidden">
          <img 
            src={thumbnail} 
            alt={`${title} thumbnail`} 
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
          />
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{category}</span>
        <Link to={`/project/${id}`} className="block">
          <h3 className={`text-xl font-medium mt-1 mb-3 hover:text-${accentColor}-400 transition-colors`}>
            {title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    accentColor: PropTypes.string.isRequired
  }).isRequired
};

export default ProjectCard;