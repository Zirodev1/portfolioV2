const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @desc    Create a Stripe checkout session
 * @route   POST /api/payments/create-checkout-session
 * @access  Public
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('Creating checkout session for product ID:', productId);

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    // Find product in database
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log('Product not found with ID:', productId);
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    console.log('Found product:', product.title);

    // Determine the correct price based on whether product is on sale
    const priceAmount = product.onSale && product.salePrice 
      ? product.salePrice 
      : product.price;

    console.log('Using price:', priceAmount);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.thumbnail],
            },
            unit_amount: Math.round(priceAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/products/${product._id}`,
      metadata: {
        productId: product._id.toString(),
      },
    });

    console.log('Checkout session created with ID:', session.id);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Handle Stripe webhook events
 * @route   POST /api/payments/webhook
 * @access  Public
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Extract product ID from metadata
    const productId = session.metadata.productId;
    
    // Extract customer email
    const customerEmail = session.customer_details.email;
    
    // Find or create user
    let user = await User.findOne({ email: customerEmail });
    
    if (!user) {
      // Create user with basic information from Stripe
      user = new User({
        email: customerEmail,
        name: session.customer_details.name,
        // Set a random password that the user can reset later
        password: require('crypto').randomBytes(16).toString('hex'),
      });
      await user.save();
    }
    
    // Add product to user's purchases
    if (!user.purchases.includes(productId)) {
      user.purchases.push(productId);
      await user.save();
    }
    
    // Increment the product's purchase count
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { purchaseCount: 1 } }
    );
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

/**
 * @desc    Get user's purchased products
 * @route   GET /api/payments/purchases
 * @access  Private
 */
const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('purchases');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user.purchases
    });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Verify if a user has purchased a specific product
 * @route   GET /api/payments/verify-purchase/:productId
 * @access  Private
 */
const verifyPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const hasPurchased = user.purchases.includes(productId);
    
    res.json({
      success: true,
      data: {
        hasPurchased
      }
    });
  } catch (error) {
    console.error('Error verifying purchase:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Verify a Stripe checkout session
 * @route   GET /api/payments/verify-session/:sessionId
 * @access  Public
 */
const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if the payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }
    
    // Extract product ID from metadata
    const productId = session.metadata.productId;
    
    // Get product details
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Format amount
    const amount = session.amount_total / 100; // Convert from cents
    
    res.json({
      success: true,
      data: {
        product,
        amount,
        customer: session.customer_details,
        paymentId: session.payment_intent,
        createdAt: new Date(session.created * 1000) // Convert Unix timestamp to Date
      }
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getUserPurchases,
  verifyPurchase,
  verifySession
};
