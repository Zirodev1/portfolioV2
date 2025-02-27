// server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});