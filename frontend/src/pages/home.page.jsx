import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import SideBar from "../components/sidebar.component";
import ProductsSection from "../components/ProductsSection";
import FeaturedWorkSection from "../components/FeaturedWorkSection";
import TestimonialsSection from "../components/TestimonialsSection";
import profilePNG from '../imgs/about.png';
import { avatarPlaceholder, thumbnailPlaceholder } from '../assets/placeholders';
import axios from 'axios';
import SkillsSection from "../components/SkillsSection";
import EmptyBlogState from "../components/EmptyBlogState";

const HomePage = () => {
  const [recentBlogPosts, setRecentBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Testimonials data
  const testimonials = [
    {
      quote: "Jackson possesses an exceptional talent for translating complex ideas into stunning and user-centric designs. He consistently goes above and beyond to understand the core essence of a product and its intended audience, resulting in designs that are not only visually appealing but also highly functional.",
      author: "John Smith",
      role: "CEO",
      company: "MINDFUL",
      avatar: avatarPlaceholder
    },
    {
      quote: "I can't recommend Jackson enough. He brought a fresh perspective to our project and consistently delivered designs that were not only visually appealing but also aligned with our project goals. His collaborative approach and commitment to excellence make him an invaluable asset to any design endeavor.",
      author: "Stacy Sampson",
      role: "LEAD ENGINEER",
      company: "LUXE ARCHITECTS",
      avatar: avatarPlaceholder
    },
    {
      quote: "Jackson effortlessly translated our concepts into visually stunning designs that not only captured our brand essence but also resonated with our target audience. His attention to detail and innovative thinking truly set him apart.",
      author: "Angelina Corales",
      role: "HEAD OF DESIGN",
      company: "PEDALS",
      avatar: avatarPlaceholder
    },
    {
      quote: "Jackson is a design wizard! He took our vague ideas and transformed them into sleek, intuitive designs that exceeded our expectations. His ability to balance creativity with practicality resulted in a product that's both aesthetically pleasing and user-friendly.",
      author: "Jackie Johnson",
      role: "STAFF PRODUCT DESIGNER",
      company: "NIKE",
      avatar: avatarPlaceholder
    }
  ];


  // Featured projects data
  const featuredProjects = [
    {
      id: "1",
      category: "E-Commerce",
      title: "Shopify Store Redesign",
      description: "A complete redesign of an e-commerce platform with improved user flow and conversion optimization.",
      thumbnail: thumbnailPlaceholder,
      accentColor: "blue"
    },
    {
      id: "2",
      category: "SaaS Dashboard",
      title: "Analytics Platform",
      description: "A dashboard interface design for a data analytics platform focusing on data visualization.",
      thumbnail: thumbnailPlaceholder,
      accentColor: "purple"
    },
    {
      id: "3",
      category: "Mobile App",
      title: "Fitness Tracker",
      description: "A mobile application designed to help users track their fitness goals and progress.",
      thumbnail: thumbnailPlaceholder,
      accentColor: "green"
    }
  ];

  // Blog posts data
  const postThumbnails = [
    "/assets/images/blog-1.jpg",
    "/assets/images/blog-2.jpg",
    "/assets/images/blog-3.jpg",
    "/assets/images/blog-4.jpg",
    "/assets/images/blog-5.jpg",
  ];

  // Products data
  const featuredProducts = [
    {
      id: "compo-portfolio",
      platform: "FRAMER",
      title: "Compo Portfolio Template",
      price: 69,
      description: "A minimal and professional portfolio template for designers and creatives.",
      thumbnail: thumbnailPlaceholder
    },
    {
      id: "capsule-blog",
      platform: "NOTION + SUPER",
      title: "Capsule Blog Template",
      price: 15,
      description: "A clean, customizable blog template powered by Notion and Super.",
      thumbnail: thumbnailPlaceholder
    }
  ];

  // Fetch recent blog posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        console.log("Fetching recent blog posts (including drafts)");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog`, {
          params: {
            // For testing, include all posts regardless of status
            // status: 'published', 
            limit: 3,
            sort: 'createdAt,desc'
          }
        });

        console.log('Blog API response data:', response.data);
        console.log('Posts received:', response.data?.data?.length || 0);

        if (response.data && response.data.success) {
          setRecentBlogPosts(response.data.data);
        } else {
          console.error('Failed to fetch recent blog posts:', response.data);
        }
      } catch (error) {
        console.error('Error fetching recent blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Format date for blog posts
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="w-full min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-start justify-between p-10 md:p-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Hey, I&apos;m Lee</h1>
            <h2 className="text-3xl font-bold text-gray-300 mb-6">Full-Stack Expert</h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              I am a seasoned product designer with 5 years of experience specializing in SaaS solutions, 
              crafting user-centric experiences that drive innovation and efficiency.
            </p>
            <div className="flex space-x-6 mb-10">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <div className="border border-gray-700 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                  </svg>
                </div>
              </Link>
              <Link to="https://www.linkedin.com/in/lee-acevedo/" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <div className="border border-gray-700 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <div className="border border-gray-700 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </div>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                <div className="border border-gray-700 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
              </Link>
            </div>
            <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Contact Me
            </Link>
          </div>
          <div className="relative mt-8 md:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
            <div className="relative">
              <img 
                src={profilePNG} 
                alt="Jackson's profile" 
                className="w-64 h-64 object-cover rounded-lg border-2 border-gray-800"
              />
              <div className="absolute -top-3 -right-3 bg-green-900 bg-opacity-90 text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Open to work
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Work Section */}
        <FeaturedWorkSection projects={featuredProjects} />
        
        {/* Testimonials Section */}
        <TestimonialsSection testimonials={testimonials} />
        
        {/* My Products Section */}
        <ProductsSection products={featuredProducts} />
        
        {/* Skills Section */}
        <SkillsSection />
        
        {/* Recent Blog Posts Section */}
        <div className="p-10 md:p-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            <Link 
              to="/blog" 
              className="text-blue-400 hover:text-blue-300"
            >
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recentBlogPosts && recentBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentBlogPosts.map((post, index) => (
                <div key={post._id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <img 
                      src={post.thumbnail || postThumbnails[index % postThumbnails.length]} 
                      alt={post.title} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md mr-3">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(post.publishDate || post.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-bold hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyBlogState 
              message="No blog posts yet" 
              buttonText="Browse All Articles"
              buttonLink="/blog"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;