import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import BlogPostCard from "./BlogPostCard";

const BlogSection = ({ featuredPosts }) => {
  return (
    <div className="p-10 md:p-16 pt-0">
      <h2 className="text-3xl font-bold mb-12">Blog</h2>
      <div className="space-y-8 mb-8">
        {featuredPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
      
      {/* View All Posts Button */}
      <div className="flex justify-center mb-16">
        <Link 
          to="/blog" 
          className="border border-gray-700 hover:border-gray-500 text-gray-200 py-3 px-6 w-full text-center rounded-md transition-colors"
        >
          View All Posts
        </Link>
      </div>
    </div>
  );
};

BlogSection.propTypes = {
  featuredPosts: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      readTime: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired
    })
  ).isRequired
};

export default BlogSection;