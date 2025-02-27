import { useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../components/sidebar.component';
import ProjectCard from '../components/ProjectCard';

const WorkPage = () => {
  // Categories for filtering
  const categories = ['All', 'E-Commerce', 'SaaS Dashboard', 'Web Design', 'Mobile App', 'Branding'];
  const [activeCategory, setActiveCategory] = useState('All');

  // Sample projects data - you can expand this with your actual projects
  const allProjects = [
    {
      id: "1",
      category: "E-Commerce",
      title: "Shopify Store Redesign",
      description: "A complete redesign of an e-commerce platform with improved user flow and conversion optimization.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "blue",
      featured: true
    },
    {
      id: "2",
      category: "SaaS Dashboard",
      title: "Analytics Platform",
      description: "A dashboard interface design for a data analytics platform focusing on data visualization.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "purple",
      featured: true
    },
    {
      id: "3",
      category: "Mobile App",
      title: "Fitness Tracker",
      description: "A mobile application designed to help users track their fitness goals and progress.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "green",
      featured: true
    },
    {
      id: "4",
      category: "Web Design",
      title: "Marketing Agency Website",
      description: "A modern website design for a digital marketing agency featuring case studies and service offerings.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "indigo",
      featured: false
    },
    {
      id: "5",
      category: "E-Commerce",
      title: "Fashion Store App",
      description: "A mobile e-commerce application for a fashion brand with personalized recommendations.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "pink",
      featured: false
    },
    {
      id: "6",
      category: "Branding",
      title: "Tech Startup Identity",
      description: "A complete brand identity design including logo, color palette, and brand guidelines.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "yellow",
      featured: false
    },
    {
      id: "7",
      category: "Web Design",
      title: "Restaurant Website",
      description: "A responsive website for a high-end restaurant featuring online reservations and menu showcase.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "red",
      featured: false
    },
    {
      id: "8",
      category: "SaaS Dashboard",
      title: "Project Management Tool",
      description: "A dashboard redesign for a project management tool focusing on task organization and team collaboration.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "teal",
      featured: false
    },
    {
      id: "9",
      category: "Mobile App",
      title: "Travel Planner",
      description: "A mobile app that helps users plan and organize their trips with itinerary management.",
      thumbnail: "https://via.placeholder.com/600x400",
      accentColor: "cyan",
      featured: false
    }
  ];

  // Filter projects based on active category
  const filteredProjects = activeCategory === 'All' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeCategory);

  return (
    <div className="flex">
      <SideBar />
      <div className="w-full min-h-screen border-gray-700">
        <div className="p-10 md:p-16">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">My Work</h1>
            <p className="text-gray-400 text-lg max-w-3xl">
              Explore my portfolio of design projects spanning across various industries and platforms. 
              Each project represents a unique challenge and solution that I've crafted with attention to detail and user-centric design principles.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-300 mb-4">No projects found in this category</h3>
              <button
                onClick={() => setActiveCategory('All')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA Section */}
        <div className="bg-gray-900 p-10 md:p-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in working together?</h2>
            <p className="text-gray-400 text-lg mb-8">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
            <Link 
              to="/contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors inline-block"
            >
              Let's Talk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPage;