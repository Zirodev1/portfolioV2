import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SideBar from "../components/sidebar.component";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real application, you would fetch post data from an API or database
  // For now, we'll use dummy data
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      // This would be replaced with your actual data fetching
      const postData = {
        slug: slug,
        title: "Building Scalable Node.js APIs with Express and MongoDB",
        category: "Backend",
        date: "Oct 12, 2023",
        readTime: "8 min read",
        author: {
          name: "Lee Acevedo",
          role: "Full-Stack Engineer",
          avatar: "https://via.placeholder.com/100"
        },
        thumbnail: "https://via.placeholder.com/1200x600",
        content: `
## Introduction

Building scalable APIs is a critical skill for modern full-stack engineers. In this article, I'll share my approach to creating robust and maintainable Node.js APIs using Express and MongoDB that can scale with your application needs.

### Why Node.js, Express, and MongoDB?

The MERN stack (MongoDB, Express, React, Node.js) has become one of the most popular technology stacks for building modern web applications. Its JavaScript-everywhere paradigm simplifies development and enables engineers to work seamlessly across the entire stack.

## Setting Up the Project Structure

A well-organized project structure is critical for maintainability as your application grows. Here's my recommended structure for a scalable API:

\`\`\`
/project-root
  /src
    /config       # Configuration files
    /controllers  # Request handlers
    /middleware   # Custom middleware
    /models       # Database models
    /routes       # API routes
    /services     # Business logic
    /utils        # Utility functions
    app.js        # Express app setup
    server.js     # Server entry point
  /tests          # Test files
  .env            # Environment variables
  package.json
\`\`\`

## Database Design for Scalability

When working with MongoDB, it's important to design your schemas with scaling in mind. Here are some key principles:

### 1. Proper Indexing

```javascript
// Example of creating indexes in MongoDB
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    index: true 
  },
  // Other fields...
});

// Create compound index for frequently queried fields
UserSchema.index({ createdAt: 1, role: 1 });
```

### 2. Data Modeling and Relationships

MongoDB is fundamentally different from relational databases, and proper data modeling can significantly impact performance. Consider these patterns:

- **Embedding documents** for data frequently accessed together
- **Using references** for relationships with large or frequently changing data
- **Denormalization** for read-heavy operations

## Performance Optimization Techniques

### Implementing Pagination

```javascript
// Example pagination implementation
router.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Product.countDocuments();
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Caching Strategies

Implementing caching is essential for high-traffic APIs. Redis is an excellent choice for this:

```javascript
// Example of Redis caching middleware
const redisClient = redis.createClient();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    
    redisClient.get(key, (err, reply) => {
      if (reply) {
        res.send(JSON.parse(reply));
        return;
      }
      
      res.sendResponse = res.send;
      res.send = (body) => {
        redisClient.set(key, JSON.stringify(body), 'EX', duration);
        res.sendResponse(body);
      };
      next();
    });
  };
};

// Using the cache middleware
app.get('/api/products', cacheMiddleware(300), productController.getAllProducts);
```

## Error Handling and Logging

Proper error handling is crucial for production applications. I recommend:

1. Custom error classes
2. Central error handling middleware
3. Structured logging

```javascript
// Custom error class
class APIError extends Error {
  constructor(message, statusCode, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err.details 
      })
    }
  };
  
  // Log the error
  logger.error({
    message: \`\${statusCode} - \${err.message}\`,
    path: req.path,
    method: req.method,
    ip: req.ip,
    ...(err.details && { details: err.details })
  });
  
  res.status(statusCode).json(errorResponse);
});
```

## Authentication and Authorization

For secure APIs, implement JWT-based authentication with role-based access control:

```javascript
// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new APIError('Authentication required', 401);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new APIError('User not found', 404);
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(new APIError('Invalid token', 401));
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError('Not authorized to access this route', 403)
      );
    }
    next();
  };
};

// Using the middleware
router.post('/api/admin/users', authenticate, authorize('admin'), userController.createUser);
```

## Conclusion

Building scalable Node.js APIs requires careful planning, proper architecture, and implementation of best practices. By following the patterns and techniques covered in this article, you'll be well-equipped to create robust APIs that can handle growth and maintain performance under load.

Remember that scalability is a journey, not a destination. Continuously monitor your application's performance, refine your approach, and adapt to changing requirements.

In my next article, I'll dive deeper into implementing real-time features with Socket.io to complement your REST API. Stay tuned!
        `,
        tags: ["Node.js", "Express", "MongoDB", "API Development", "Backend"],
        relatedPosts: [
          {
            slug: "graphql-vs-rest",
            title: "GraphQL vs REST: Choosing the Right API Paradigm",
            thumbnail: "https://via.placeholder.com/300x200",
            category: "Backend"
          },
          {
            slug: "typescript-best-practices",
            title: "TypeScript Best Practices for Large-Scale Applications",
            thumbnail: "https://via.placeholder.com/300x200",
            category: "Web Development"
          },
          {
            slug: "docker-microservices",
            title: "Containerizing Microservices with Docker and Orchestrating with Kubernetes",
            thumbnail: "https://via.placeholder.com/300x200",
            category: "DevOps"
          }
        ]
      };
      
      setPost(postData);
      setLoading(false);
    }, 500);
  }, [slug]);

  // Function to parse markdown content with code blocks
  const renderContent = (content) => {
    // This is a simple implementation. In a real app, you'd use a library like react-markdown
    const sections = content.split('\n## ');
    
    return (
      <div className="markdown-content">
        {sections.map((section, index) => {
          if (index === 0) {
            return <div key={index} dangerouslySetInnerHTML={{ __html: section.replace(/\n/g, '<br/>') }} />;
          }
          
          const sectionTitle = section.split('\n')[0];
          const sectionContent = section.split('\n').slice(1).join('\n');
          
          return (
            <div key={index} className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
              <div dangerouslySetInnerHTML={{ 
                __html: sectionContent
                  .replace(/###\s(.*)/g, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
                  .replace(/```(javascript|)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 p-4 rounded-md overflow-x-auto my-4"><code>$2</code></pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-gray-900 px-1 py-0.5 rounded text-sm">$1</code>')
                  .replace(/\n/g, '<br/>')
              }} />
            </div>
          );
        })}
      </div>
    );
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

  if (!post) {
    return (
      <div className="flex">
        <SideBar />
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
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
              {post.tags.map((tag) => (
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
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-gray-400">{post.author.role}</p>
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">
                <span>{post.date}</span>
                <span className="mx-3">·</span>
                <span>{post.readTime}</span>
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
              {renderContent(post.content)}
            </div>

            {/* Author Bio */}
            <div className="mt-16 p-8 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-16 h-16 rounded-full mr-6"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">Written by {post.author.name}</h3>
                  <p className="text-gray-300">
                    Full-stack engineer with a passion for building scalable applications and sharing knowledge with the developer community.
                  </p>
                </div>
              </div>
            </div>

            {/* Share Links */}
            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <div className="text-xl font-bold">Share this article</div>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {post.relatedPosts.map((related) => (
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

            {/* Comments Section - You could integrate with Disqus or a custom solution */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-8">Comments</h3>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-300 mb-4">
                  Join the discussion and share your thoughts on this article.
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Sign in to comment
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