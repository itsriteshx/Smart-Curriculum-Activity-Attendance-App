/**
 * @file server.js
 * @description Main entry point for the Smart Agricultural Advisory System Backend.
 * Sets up Express HTTP server, database connection, middleware pipeline,
 * and API route bindings.
 * 
 * Viva tip:
 * Middleware Pipeline Order:
 * 1. Security & Parsing (cors, json, urlencoded)
 * 2. Logging (morgan)
 * 3. Route Handlers (/api/auth, /api/farmer, /api/weather)
 * 4. 404 Fallback Handler
 * 5. Global Error Handler (4 arguments: err, req, res, next)
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

// Import Error Middlewares
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

// Enable Cross-Origin Resource Sharing (allows frontend apps to access API)
app.use(cors());

// Parse incoming JSON request payloads
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// HTTP request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ==========================================
// HEALTH CHECK & ROOT ROUTE
// ==========================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌾 Welcome to Smart Agricultural Advisory System API (Day 1 Backend)',
    version: '1.0.0',
    documentation: '/api/docs or check README.md',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
      },
      farmer: {
        createProfile: 'POST /api/farmer/profile',
        getMyProfile: 'GET /api/farmer/me',
        getProfile: 'GET /api/farmer/profile/:farmerId',
        updateProfile: 'PUT /api/farmer/profile/:farmerId',
        completion: 'GET /api/farmer/profile/:farmerId/completion',
      },
      weather: {
        getWeatherAndAdvisory: 'GET /api/weather/:lat/:long',
      },
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

// ==========================================
// API ROUTES MOUNTING
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/weather', weatherRoutes);

// ==========================================
// ERROR HANDLING PIPELINE
// ==========================================

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Centralized application error handler
app.use(errorHandler);

// ==========================================
// SERVER INITIALIZATION
// ==========================================

const PORT = process.env.PORT || 5000;

// Export app for tests or start listener if run directly
if (require.main === module) {
  let activePort = PORT;

  const startServer = (portToTry) => {
    const server = app.listen(portToTry, () => {
      console.log(`
🌾 ========================================================= 🌾
   Smart Agricultural Advisory System - Backend Initialized
   ---------------------------------------------------------
   Server Running on : http://localhost:${portToTry}
   Environment       : ${process.env.NODE_ENV || 'development'}
   Health Check      : http://localhost:${portToTry}/api/health
   Base Weather API  : http://localhost:${portToTry}/api/weather/28.61/77.20
🌾 ========================================================= 🌾
      `);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️  Port ${portToTry} is already in use (often macOS AirPlay on 5000).`);
        const nextPort = Number(portToTry) + 1;
        console.log(`🔄 Automatically attempting next available port: ${nextPort}...`);
        startServer(nextPort);
      } else {
        console.error(`💥 Server Error: ${err.message}`);
      }
    });

    // Handle unhandled promise rejections gracefully
    process.on('unhandledRejection', (err) => {
      console.error(`💥 Unhandled Promise Rejection: ${err.message}`);
    });
  };

  startServer(activePort);
}

module.exports = app;
