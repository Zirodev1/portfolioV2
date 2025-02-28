const formData = require('form-data');
const Mailgun = require('mailgun.js');

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API
});

/**
 * @desc    Send contact form email
 * @route   POST /api/contact
 * @access  Public
 */
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please fill in all fields' 
      });
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }
    
    // Email content
    const emailData = {
      from: `Contact Form <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: process.env.CONTACT_EMAIL || 'lee.acevedo786@gmail.com', // Your email where you want to receive messages
      subject: `Portfolio Contact: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      // Add a reply-to header so you can directly reply to the sender
      'h:Reply-To': email
    };
    
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
};

module.exports = {
  sendContactEmail
};