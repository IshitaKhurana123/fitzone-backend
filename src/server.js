const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Use .env files

const app = express();

// A more secure CORS setup for production.
// IMPORTANT: You must add your deployed frontend URL here later.
const allowedOrigins = [
  'http://localhost:5500', // For local development
  'http://127.0.0.1:5500',
  'https://fitzone-frontend-u6oo.onrender.com' // Placeholder for your live frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('Error: MONGODB_URI is not defined in the .env file. The server cannot start.');
    process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('DB connection error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth')); // Handles all login requests
app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));

// Get port from environment variables, with a fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


