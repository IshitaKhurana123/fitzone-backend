const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Use .env files

const app = express();

// A more secure CORS setup for production
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://fitzone-s0xu.onrender.com'
  // You will add your deployed Render frontend URL here later
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('DB connection error:', err));

app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));

// Get port from environment variables, with a fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

