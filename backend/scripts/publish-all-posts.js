require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find all draft posts
      const draftPosts = await BlogPost.find({ status: 'draft' });
      
      console.log(`Found ${draftPosts.length} draft posts to publish`);
      
      // Update all draft posts to published
      if (draftPosts.length > 0) {
        const updatePromises = draftPosts.map(post => {
          return BlogPost.findByIdAndUpdate(
            post._id,
            { 
              status: 'published',
              publishDate: post.publishDate || new Date()
            },
            { new: true }
          );
        });
        
        const updatedPosts = await Promise.all(updatePromises);
        
        console.log('\nSuccessfully published posts:');
        updatedPosts.forEach((post, index) => {
          console.log(`${index + 1}. ${post.title} (${post.slug})`);
        });
      } else {
        console.log('No draft posts to publish');
      }
      
      // List all published posts
      const publishedPosts = await BlogPost.find({ status: 'published' }).sort({ publishDate: -1 });
      
      console.log(`\nTotal published posts: ${publishedPosts.length}`);
      publishedPosts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} (${post.slug})`);
      });
      
    } catch (error) {
      console.error('Error publishing posts:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('\nDisconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 