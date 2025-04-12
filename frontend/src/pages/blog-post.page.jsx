import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/sidebar.component";
import EditorJSRenderer from "../components/EditorJSRenderer";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching blog post with slug: ${slug}`);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/${slug}`);
        
        if (response.data.success) {
          console.log("Blog post fetched successfully:", response.data);
          setPost(response.data.data);
          
          // Fetch related posts based on category or tags
          if (response.data.data.category) {
            fetchRelatedPosts(response.data.data.category, response.data.data.tags, response.data.data._id);
          }
        } else {
          setError("Failed to fetch blog post");
          console.error("API returned error:", response.data);
        }
      } catch (error) {
        setError("Error fetching blog post");
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  // Fetch related posts
  const fetchRelatedPosts = async (category, tags, currentPostId) => {
    try {
      // Fetch posts with the same category, excluding the current post
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog`, {
        params: {
          category,
          status: 'published',
          limit: 3
        }
      });

      if (response.data.success) {
        // Filter out the current post and limit to 3 related posts
        const related = response.data.data
          .filter(post => post._id !== currentPostId)
          .slice(0, 3)
          .map(post => ({
            slug: post.slug,
            title: post.title,
            thumbnail: post.thumbnail,
            category: post.category
          }));
          
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  if (error || !post) {
    return (
      <div className="flex">
        <SideBar />
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-400 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link 
              to="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Back to Blog
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
        {/* Article Header */}
        <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 p-10 md:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              {post.tags && post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-gray-700 bg-opacity-50 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <img 
                  src={post.author?.avatar || 'https://via.placeholder.com/100'} 
                  alt={post.author?.name || post.author} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium">{post.author?.name || post.author}</p>
                  <p className="text-sm text-gray-400">{post.author?.role || 'Author'}</p>
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">
                <span>{formatDate(post.publishDate || post.createdAt)}</span>
                <span className="mx-3">·</span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="w-full">
          <img 
            src={post.thumbnail} 
            alt={post.title} 
            className="w-full h-80 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="p-10 md:p-16">
          <div className="max-w-4xl mx-auto">
            {/* Article Body */}
            <div className="prose prose-lg prose-invert max-w-none">
              <EditorJSRenderer content={post.content} />
            </div>

            {/* Author Bio */}
            <div className="mt-16 p-8 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <img 
                  src={post.author?.avatar || 'https://via.placeholder.com/100'} 
                  alt={post.author?.name || post.author} 
                  className="w-16 h-16 rounded-full mr-6"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">Written by {post.author?.name || post.author}</h3>
                  <p className="text-gray-300">
                    {post.author?.bio || 'Full-stack engineer with a passion for building scalable applications and sharing knowledge with the developer community.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Share Links */}
            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <div className="text-xl font-bold">Share this article</div>
              <div className="flex gap-4">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <div key={related.slug} className="bg-gray-800 rounded-lg overflow-hidden">
                      <Link to={`/blog/${related.slug}`} className="block">
                        <img 
                          src={related.thumbnail} 
                          alt={related.title} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <span className="text-xs text-blue-400 font-medium block mb-2">{related.category}</span>
                          <h4 className="font-medium hover:text-blue-400 transition-colors">{related.title}</h4>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="mt-16 p-8 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enjoyed this article?</h3>
                <p className="text-gray-300">
                  Subscribe to my newsletter for more content on full-stack development, best practices, and industry insights.
                </p>
              </div>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border border-gray-700 rounded-l-md py-3 px-4 text-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;