/**
 * Handle 404 Not Found errors
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  // If response status is still 200, set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set status code
  res.status(statusCode);
  
  // Prepare response
  const response = {
    success: false,
    error: err.message,
  };
  
  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  // Handle mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400);
    response.error = Object.values(err.errors).map(val => val.message).join(', ');
  }
  
  // Handle mongoose duplicate key error
  if (err.code === 11000) {
    res.status(400);
    const field = Object.keys(err.keyValue)[0];
    response.error = `Duplicate field value entered: ${field} already exists`;
  }
  
  // Handle mongoose cast error
  if (err.name === 'CastError') {
    res.status(400);
    response.error = `Invalid ${err.path}: ${err.value}`;
  }
  
  // Send JSON response
  res.json(response);
};

module.exports = { notFound, errorHandler }