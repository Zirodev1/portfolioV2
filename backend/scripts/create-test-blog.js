require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Create a test blog post with published status
      const testPost = await BlogPost.create({
        title: 'Getting Started with MERN Stack Development',
        slug: 'getting-started-with-mern-stack',
        content: {
          time: Date.now(),
          blocks: [
            {
              id: '1',
              type: 'paragraph',
              data: {
                text: 'The MERN stack is a JavaScript stack for building modern web applications. MERN stands for MongoDB, Express, React, and Node.js.'
              }
            },
            {
              id: '2',
              type: 'paragraph',
              data: {
                text: 'This powerful combination allows developers to create full-stack applications using JavaScript throughout the entire stack.'
              }
            },
            {
              id: '3',
              type: 'header',
              data: {
                text: 'Why Choose MERN Stack?',
                level: 2
              }
            },
            {
              id: '4',
              type: 'paragraph',
              data: {
                text: 'MERN offers several advantages for modern web development:'
              }
            },
            {
              id: '5',
              type: 'list',
              data: {
                style: 'unordered',
                items: [
                  'JavaScript everywhere - same language for frontend and backend',
                  'JSON data format throughout the application',
                  'NoSQL database for flexibility and scalability',
                  'Rich ecosystem of libraries and tools',
                  'Strong community support and documentation'
                ]
              }
            }
          ],
          version: '2.31.0'
        },
        excerpt: 'Learn about the MERN stack (MongoDB, Express, React, Node.js) and how to build modern web applications using JavaScript throughout the entire stack.',
        category: 'Web Development',
        tags: ['MongoDB', 'Express', 'React', 'Node.js', 'JavaScript'],
        thumbnail: '/assets/images/blog-1.jpg',
        status: 'published', // This is important - set to published
        author: 'Lee Acevedo',
        featured: true,
        publishDate: new Date(),
        readTime: '5 min read'
      });
      
      console.log('Successfully created published blog post:');
      console.log({
        id: testPost._id,
        title: testPost.title,
        status: testPost.status,
        publishDate: testPost.publishDate
      });
    } catch (error) {
      console.error('Error creating test blog post:', error);
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