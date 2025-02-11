require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mainRoutes = require("./routes/mainRoutes");
const rateLimit = require("./config/rateLimit");

// Initialize Express app
const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  'https://console.ecellsrmist.org',
  'https://events.ecellsrmist.org', 
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:5173',
  'https://forms.ecellsrmist.org',
  'https://ecellsrmist.org'
];

app.use(cors({
  origin: function(origin, callback) {
  
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS ' , 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set("trust proxy", 1);
app.use(rateLimit);

// Middleware setup
app.use(express.json());

// API routes
app.use("/api", mainRoutes);

// Connect to database
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});