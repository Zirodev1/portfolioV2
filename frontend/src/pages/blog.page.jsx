import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../components/sidebar.component';
import BlogPostCard from '../components/BlogPostCard';
import EmptyBlogState from '../components/EmptyBlogState';

const BlogPage = () => {
  // Categories for filtering
  const categories = ['All', 'Web Development', 'Backend', 'Frontend', 'DevOps', 'Tutorials', 'Career'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for posts
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog posts on component mount and when category changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare query parameters
        const params = {};
        if (activeCategory !== 'All') {
          params.category = activeCategory;
        }
        
        // Include both draft and published posts for debugging
        // params.status = 'published';
        console.log("Fetching all blog posts, including drafts");
        
        const apiUrl = `${import.meta.env.VITE_API_URL}/blog`;
        console.log("Full API URL:", apiUrl);
        
        const response = await axios.get(apiUrl, { params });
        
        console.log("API Response:", response);
        console.log("Blog data:", response.data);
        console.log("Number of posts received:", response.data?.data?.length || 0);
        console.log("Posts data:", response.data?.data);
        
        if (response.data && response.data.success) {
          console.log("Posts fetched successfully");
          setAllPosts(response.data.data);
        } else {
          console.error("API returned error or unexpected format:", response.data);
          setError("Failed to fetch blog posts");
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        console.error("Error details:", error.response || error.message || error);
        setError("Error fetching blog posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory]);

  // Filter and search posts
  const filteredPosts = allPosts
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

  // Get featured posts
  const featuredPosts = allPosts.filter(post => post.featured);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Convert MongoDB document to format expected by BlogPostCard
  const mapPostToCardFormat = (post) => ({
    slug: post.slug,
    category: post.category,
    title: post.title,
    readTime: post.readTime || '5 min read',
    description: post.excerpt,
    thumbnail: post.thumbnail,
    date: formatDate(post.publishDate || post.createdAt),
    featured: post.featured || false
  });

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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900 bg-opacity-25 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
              <p>{error}</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="mt-2 bg-red-700 hover:bg-red-600 px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Featured Posts - Only show if search is empty and we have featured posts */}
          {!loading && !error && searchQuery === '' && featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <div key={post._id || post.slug} className="bg-gray-800 rounded-lg overflow-hidden">
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
                          <span className="text-sm text-gray-400">
                            {formatDate(post.publishDate || post.createdAt)} · {post.readTime || '5 min read'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">{post.title}</h3>
                        <p className="text-gray-400">{post.excerpt}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          {!loading && !error && (
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
          )}

          {/* All Posts */}
          {!loading && !error && filteredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">
                {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Articles' : `${activeCategory} Articles`}
              </h2>
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <BlogPostCard key={post._id || post.slug} post={mapPostToCardFormat(post)} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPosts.length === 0 && (
            <EmptyBlogState 
              onReset={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              message={
                searchQuery 
                  ? `No results found for "${searchQuery}"` 
                  : activeCategory !== 'All' 
                    ? `No articles found in category "${activeCategory}"`
                    : "No articles found"
              }
            />
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