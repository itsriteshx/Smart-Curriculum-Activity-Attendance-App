# 🌐 Comprehensive Deployment Guide

## Production Architecture
- **Backend API**: Node.js Express server on port 5000 with CORS & JWT.
- **Frontend SPA**: React Vite bundled static files served via Nginx on port 3000.
- **Database**: MongoDB 6.0 cluster.

## Environment Variables
- `PORT`: 5000
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for token generation
- `OPENWEATHER_API_KEY`: API key for live weather data
