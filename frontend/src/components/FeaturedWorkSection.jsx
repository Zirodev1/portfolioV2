import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import ProjectCard from "./ProjectCard";

const FeaturedWorkSection = ({ projects }) => {
  return (
    <div className="p-10 md:p-16 pt-0">
      <h2 className="text-3xl font-bold mb-8">Featured Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {/* Show More Work Button */}
      <div className="flex justify-center mb-16">
        <Link 
          to="/work" 
          className=" hover:bg-gray-800 text-gray-200 py-3 w-full text-center rounded-md transition-colors border border-gray-700"
        >
          Show More Work
        </Link>
      </div>
    </div>
  );
};

FeaturedWorkSection.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      accentColor: PropTypes.string.isRequired
    })
  ).isRequired
};

export default FeaturedWorkSection;