import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/sidebar.component";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch project data from an API or database
  // For now, we'll use dummy data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // This would be replaced with your actual data fetching
      const projectData = {
        id: id,
        title: "Shopify Store Redesign",
        category: "E-Commerce",
        client: "Fashion Boutique",
        timeline: "6 weeks",
        role: "Lead Product Designer",
        description: "A complete redesign of an e-commerce platform with improved user flow and conversion optimization. The client needed a modern, responsive design that would showcase their products effectively while providing an intuitive shopping experience for their customers.",
        challenge: "The main challenge was to create a seamless shopping experience across all devices while maintaining the brand's premium aesthetic. The previous website had a high cart abandonment rate and poor mobile usability.",
        solution: "I designed a clean, intuitive interface that prioritized product imagery and simplified the checkout process. By implementing a responsive design and optimizing the user journey, we were able to significantly reduce cart abandonment and increase mobile conversions.",
        results: [
          "42% increase in conversion rate",
          "67% reduction in cart abandonment",
          "89% improvement in mobile engagement",
          "52% increase in average session duration"
        ],
        technologies: ["Shopify", "Liquid", "CSS/SCSS", "JavaScript", "Figma"],
        mainImage: "https://via.placeholder.com/1200x800",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600"
        ],
        testimonial: {
          quote: "Jackson transformed our online store completely. The new design not only looks fantastic but has significantly improved our sales and customer engagement. The attention to detail and understanding of our brand was exceptional.",
          author: "Emma Rodriguez",
          role: "Marketing Director",
          company: "Fashion Boutique"
        },
        nextProject: {
          id: "2",
          title: "Analytics Platform"
        },
        prevProject: {
          id: "9",
          title: "Travel Planner"
        }
      };
      
      setProject(projectData);
      setLoading(false);
    }, 500);
  }, [id]);

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

  if (!project) {
    return (
      <div className="flex">
        <SideBar />
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/work" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Back to Work
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
        {/* Hero Section */}
        <div className="w-full h-96 relative">
          <img 
            src={project.mainImage} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-10 md:p-16">
              <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full text-white inline-block mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Column - Project Info */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              <p className="text-gray-300 mb-10 leading-relaxed">
                {project.description}
              </p>

              <h2 className="text-2xl font-bold mb-6">The Challenge</h2>
              <p className="text-gray-300 mb-10 leading-relaxed">
                {project.challenge}
              </p>

              <h2 className="text-2xl font-bold mb-6">The Solution</h2>
              <p className="text-gray-300 mb-10 leading-relaxed">
                {project.solution}
              </p>

              <h2 className="text-2xl font-bold mb-6">Results</h2>
              <ul className="list-disc list-inside text-gray-300 mb-10 space-y-2">
                {project.results.map((result, index) => (
                  <li key={index} className="leading-relaxed">{result}</li>
                ))}
              </ul>
            </div>

            {/* Right Column - Project Meta */}
            <div>
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-6">Project Details</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-1">Client</h4>
                  <p className="text-gray-200">{project.client}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-1">Timeline</h4>
                  <p className="text-gray-200">{project.timeline}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-1">Role</h4>
                  <p className="text-gray-200">{project.role}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              {project.testimonial && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Client Feedback</h3>
                  <blockquote className="text-gray-300 italic mb-4">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <div className="text-gray-400">
                    <p className="font-medium text-white">{project.testimonial.author}</p>
                    <p className="text-sm">{project.testimonial.role}, {project.testimonial.company}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Gallery */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`} 
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project Navigation */}
          <div className="mt-16 flex flex-col sm:flex-row justify-between items-center">
            {project.prevProject ? (
              <Link 
                to={`/project/${project.prevProject.id}`} 
                className="flex items-center text-gray-300 hover:text-white mb-4 sm:mb-0"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous: {project.prevProject.title}</span>
              </Link>
            ) : (
              <div></div>
            )}
            
            <Link 
              to="/work" 
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-6 rounded-md transition-colors inline-block"
            >
              All Projects
            </Link>
            
            {project.nextProject ? (
              <Link 
                to={`/project/${project.nextProject.id}`} 
                className="flex items-center text-gray-300 hover:text-white mb-4 sm:mb-0"
              >
                <span>Next: {project.nextProject.title}</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
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

export default ProjectDetailPage;