import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const FeaturedWorkSection = ({ projects }) => {
  return (
    <section className="py-16 px-10 md:px-16 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Featured Work</h2>
          <Link to="/projects" className="text-blue-400 hover:text-blue-300">
            View All Projects
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <Link to={`/projects/${project.id}`} className="block">
                <div className="relative">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title} 
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div 
                    className={`absolute bottom-0 left-0 w-full h-1 bg-${project.accentColor || 'blue'}-600`}
                  ></div>
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center text-blue-400">
                    View Project
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

FeaturedWorkSection.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      accentColor: PropTypes.string
    })
  ).isRequired
};

export default FeaturedWorkSection;