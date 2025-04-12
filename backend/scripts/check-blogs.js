require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Find all blog posts
    return BlogPost.find();
  })
  .then(posts => {
    console.log('Total blog posts in database:', posts.length);
    
    if (posts.length > 0) {
      console.log('\nBlog post titles:');
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} (${post.status}) - ${post.slug}`);
      });
      
      // Show details of the first post
      console.log('\nFirst blog post details:');
      console.log(JSON.stringify(posts[0], null, 2));
    } else {
      console.log('No blog posts found in the database');
    }
    
    // Close connection
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  }); 