// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { NODE_ENV, UPLOAD_PATH } = require('./config/config');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();


// Import routes
const productRoutes = require('./routes/productRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Logging in development
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }
  
  // Email content
  const emailData = {
    from: `Contact Form <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to: 'lee.acevedo786@gmail.com', // Your email where you want to receive messages
    subject: `Portfolio Contact: ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    // Optional: Add a reply-to header so you can directly reply to the sender
    'h:Reply-To': email
  };
  
  try {
    // Send email using Mailgun
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
    
    console.log('Email sent successfully:', result);
    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// Serve uploaded files
app.use(`/${UPLOAD_PATH}`, express.static(path.join(__dirname, UPLOAD_PATH)));

// Define routes
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Log routes for debugging
console.log('Registered routes:');
console.log('- /api/products');
console.log('- /api/blog');
console.log('- /api/users');
console.log('- /api/upload');

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Serve static files from the React frontend in production
if (NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Any route that is not API will be redirected to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});