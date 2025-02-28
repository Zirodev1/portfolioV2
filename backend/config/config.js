// Load environment variables from .env file
require('dotenv').config();

// Set default port and environment
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// JWT settings
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret_for_dev';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// File upload settings
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads/';
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5 * 1024 * 1024; // 5MB

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRE,
  MONGO_URI,
  UPLOAD_PATH,
  MAX_FILE_SIZE
};