const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const museumRoutes = require('./routes/museumRoutes');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/museums', museumRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Museum API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express API for Vercel
module.exports = app;