import { useState } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../components/sidebar.component';
import BlogPostCard from '../components/BlogPostCard';

const BlogPage = () => {
  // Categories for filtering
  const categories = ['All', 'Web Development', 'Backend', 'Frontend', 'DevOps', 'Tutorials', 'Career'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample blog posts data
  const allPosts = [
    {
      slug: "building-scalable-nodejs-apis",
      category: "Backend",
      title: "Building Scalable Node.js APIs with Express and MongoDB",
      readTime: "8 min read",
      description: "Learn how to architect and implement highly scalable RESTful APIs using Node.js, Express, and MongoDB with best practices for production.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Oct 12, 2023",
      featured: true
    },
    {
      slug: "react-performance-optimization",
      category: "Frontend",
      title: "React Performance Optimization Techniques",
      readTime: "6 min read",
      description: "Discover advanced strategies to optimize your React applications for better performance, including code-splitting, memoization, and virtualization.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Sep 28, 2023",
      featured: true
    },
    {
      slug: "docker-microservices",
      category: "DevOps",
      title: "Containerizing Microservices with Docker and Orchestrating with Kubernetes",
      readTime: "10 min read",
      description: "A comprehensive guide to containerizing your microservices architecture using Docker and orchestrating with Kubernetes for improved scalability and reliability.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Sep 15, 2023",
      featured: false
    },
    {
      slug: "typescript-best-practices",
      category: "Web Development",
      title: "TypeScript Best Practices for Large-Scale Applications",
      readTime: "7 min read",
      description: "Explore essential TypeScript patterns and practices that help maintain clean, scalable codebases in large enterprise applications.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Aug 30, 2023",
      featured: false
    },
    {
      slug: "graphql-vs-rest",
      category: "Backend",
      title: "GraphQL vs REST: Choosing the Right API Paradigm",
      readTime: "9 min read",
      description: "An in-depth comparison of GraphQL and REST API architectures, with practical guidance on when to use each approach for your projects.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Aug 18, 2023",
      featured: false
    },
    {
      slug: "tailwind-css-techniques",
      category: "Frontend",
      title: "Advanced Tailwind CSS Techniques for Modern UIs",
      readTime: "5 min read",
      description: "Learn how to leverage Tailwind CSS's utility-first approach to build complex, responsive user interfaces with minimal custom CSS.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Jul 22, 2023",
      featured: false
    },
    {
      slug: "ci-cd-pipeline-aws",
      category: "DevOps",
      title: "Building a Robust CI/CD Pipeline with AWS Services",
      readTime: "11 min read",
      description: "Step-by-step guide to creating an efficient continuous integration and deployment pipeline using AWS CodeBuild, CodePipeline, and related services.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Jul 10, 2023",
      featured: false
    },
    {
      slug: "from-junior-to-senior-dev",
      category: "Career",
      title: "From Junior to Senior Developer: Navigating Your Career Path",
      readTime: "8 min read",
      description: "Practical advice and strategies for progressing from a junior to senior developer role, focusing on technical skills, soft skills, and career management.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Jun 27, 2023",
      featured: false
    },
    {
      slug: "mern-stack-authentication",
      category: "Tutorials",
      title: "Implementing JWT Authentication in MERN Stack Applications",
      readTime: "12 min read",
      description: "A comprehensive tutorial on implementing secure user authentication using JSON Web Tokens (JWT) in MongoDB, Express, React, and Node.js applications.",
      thumbnail: "https://via.placeholder.com/600x400",
      date: "Jun 15, 2023",
      featured: false
    }
  ];

  // Filter and search posts
  const filteredPosts = allPosts
    .filter(post => activeCategory === 'All' || post.category === activeCategory)
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Get featured posts
  const featuredPosts = allPosts.filter(post => post.featured);

  return (
    <div className="flex">
      <SideBar />
      <div className="w-full min-h-screen border-gray-700">
        <div className="p-10 md:p-16">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
            <p className="text-gray-400 text-lg max-w-3xl">
              Technical insights, tutorials, and thoughts on full stack development, 
              covering everything from frontend frameworks to backend architecture, DevOps, and career growth.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-3 px-4 pr-12 text-gray-300 focus:outline-none focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Featured Posts - Only show if search is empty */}
          {searchQuery === '' && featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <div key={post.slug} className="bg-gray-800 rounded-lg overflow-hidden">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title} 
                        className="w-full h-56 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md mr-3">
                            {post.category}
                          </span>
                          <span className="text-sm text-gray-400">{post.date} · {post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">{post.title}</h3>
                        <p className="text-gray-400">{post.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
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

          {/* All Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">
              {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Articles' : `${activeCategory} Articles`}
            </h2>
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-300 mb-4">No articles found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter to find what you're looking for</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                View All Articles
              </button>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-8 mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold mb-2">Subscribe to my newsletter</h3>
                  <p className="text-gray-300 mb-4">
                    Get the latest articles, tutorials, and resources on full stack development delivered to your inbox.
                  </p>
                </div>
                <div className="md:w-1/3 w-full">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-gray-800 border border-gray-700 rounded-l-md py-3 px-4 text-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-r-md transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;