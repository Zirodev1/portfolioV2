require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find all blog posts
      const posts = await BlogPost.find().sort({ createdAt: -1 });
      
      console.log(`Found ${posts.length} blog posts:\n`);
      
      // Display each post with its slug and status
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   ID: ${post._id}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Status: ${post.status}`);
        console.log(`   Created: ${post.createdAt}`);
        console.log('');
      });
    } catch (error) {
      console.error('Error listing blog posts:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 