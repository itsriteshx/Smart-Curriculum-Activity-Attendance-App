# 🌾 Smart Agricultural Advisory System (KisanSeva Terminal Application)
**Project Name:** Smart Curriculum Activity & Attendance App / Kisan Advisory System  
**Student:** Ritesh Kumar (ADYPU - E25B070681)  
**Submission Type:** Interactive Terminal Application (CLI)

An intelligent, interactive **Terminal Application (CLI)** and backend advisory suite built with **Node.js, Express.js, and MongoDB** designed to empower Indian smallholder farmers with personalized agronomic advisories, soil health diagnostics, real-time agro-meteorological alerts, pest treatment protocols, and Mandi price analytics.

---

## ⚡ Quick Start (Run Terminal Application)

To launch the interactive Terminal Application CLI:
```bash
# 1. Install dependencies
npm install

# 2. Start the Terminal Application
npm start
```
*(Or run directly: `node cli.js`)*

### 🎮 Terminal CLI Features:
1. **🌾 Crop Recommendation Engine:** Evaluates Season, Soil, and Water availability using a weighted multi-factor algorithm.
2. **🧪 Soil Health & Fertilizer Calculator:** Calculates exact commercial bags of Urea (45kg), DAP (50kg), and MOP (50kg).
3. **🌦️ Weather-Based Farm Advisory:** Rainfall and wind alerts for irrigation postponement and safe spraying windows.
4. **🐛 Pest & Crop Disease Diagnosis:** Symptom matching with confidence %, organic bio-remedies, and chemical controls.
5. **📈 Mandi Market Prices & Selling Advisory:** APMC mandi modal rates compared to MSP with clear SELL or HOLD advice.
6. **🌐 Bilingual Support:** Instant toggle between English and Hindi (हिन्दी).
7. **📝 Farmer Feedback Collection:** Continuous feedback loop with local JSON audit persistence.

---

## 📌 Day 1 Architecture & Infrastructure Overview

During **Day 1**, we have established the robust core backend infrastructure:
1. **Production-grade Express.js REST API Server** with modular architecture (MVC pattern).
2. **MongoDB ODM Database Layer** via Mongoose with connection pooling and event listeners.
3. **Role-Based JWT Authentication System** with password hashing via `bcryptjs` and pre-save hooks.
4. **Farmer Profile Management System** capturing geo-location, soil categorization (Alluvial, Black Cotton, Loamy, etc.), farm size, water sources, and seasonal crop logs.
5. **Agro-Meteorological Weather Service & Advisory Engine** integrated with OpenWeatherMap, with an in-memory 30-minute caching layer (`node-cache`) and bilingual recommendations (English & Hindi) for irrigation, spraying, pest alerts, and field operations.
6. **Centralized Error Handling Pipeline** capturing Mongoose validation, duplicate keys (11000), bad ObjectIds, and JWT expiration errors.
7. **Viva & College Exam Ready** with JSDoc comments and explanatory annotations on every function.

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | Non-blocking asynchronous event loop |
| **Web Framework** | Express.js (v4.21+) | HTTP REST API routing and middleware pipeline |
| **Database** | MongoDB (Local or Atlas) | NoSQL document database for dynamic agricultural data |
| **ODM** | Mongoose (v8.9+) | Schema modeling, validation, and pre-save hooks |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless token-based security |
| **Cryptography** | `bcryptjs` | Salting and hashing farmer passwords |
| **Security & Utilities**| `cors`, `dotenv` | Cross-Origin resource sharing & environment loading |
| **Logging** | `morgan` | HTTP request telemetry in development |
| **Weather & Cache** | `axios`, `node-cache` | Weather API calls and 30-min TTL in-memory caching |

---

## 📂 Project Directory Structure

```text
├── package.json                   # Project metadata and dependencies
├── .env                           # Active environment variables (git-ignored)
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore rules
├── README.md                      # Complete documentation & Viva study guide
├── test-api.js                    # Automated verification test suite
└── src/
    ├── server.js                  # Application entry point & HTTP listener
    ├── config/
    │   └── db.js                  # MongoDB connection handler & event listeners
    ├── constants/
    │   ├── roles.js               # Enums: ROLES, SOIL_TYPES, WATER_AVAILABILITY
    │   └── messages.js            # Standardized API response messages
    ├── models/
    │   ├── User.js                # User schema (email, phone, bcrypt hash, role)
    │   └── Farmer.js              # Farmer profile schema (geo-coords, soil, crops)
    ├── middleware/
    │   ├── authMiddleware.js      # verifyToken (JWT) & authorizeRoles (RBAC)
    │   ├── validateMiddleware.js  # Input payload validation (Fail Fast)
    │   └── errorMiddleware.js     # Centralized 404 & global error interceptor
    ├── services/
    │   └── weatherService.js      # Weather fetcher, 30m cache & agronomic rules
    ├── controllers/
    │   ├── authController.js      # Register, Login, Logout, Profile handlers
    │   ├── farmerController.js    # Farm profile CRUD & completion analytics
    │   └── weatherController.js   # Coordinate-based weather & advisory endpoint
    └── routes/
        ├── authRoutes.js          # /api/auth routes
        ├── farmerRoutes.js        # /api/farmer routes (JWT Protected)
        └── weatherRoutes.js       # /api/weather routes
```

---

## ⚙️ Installation & Setup Guide

### 1. Clone or Open Workspace
Ensure you are inside the project folder:
```bash
cd "/Users/riteshkumar/Desktop/Smart Attandance "
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (already done by setup):
```bash
cp .env.example .env
```

Review the values in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/smart_agriculture_db
JWT_SECRET=supersecret_agri_advisor_jwt_key_2026_dev_secure
JWT_EXPIRE=7d
OPENWEATHER_API_KEY=your_openweathermap_key_here
```
> **Note on Weather API**: If you do not have an OpenWeatherMap API key right now, leave it empty. The built-in mock fallback engine automatically generates realistic Indian agro-meteorological conditions so you can test all advisory features immediately!

### 4. Run Automated Test Suite
```bash
npm test
```
This runs `test-api.js` which verifies hashing, schema methods, weather normalization, memory caching, and recommendation algorithms without needing an active database connection.

### 5. Start the Server
For development with auto-reload:
```bash
npm run dev
```
For standard production start:
```bash
npm start
```
The server will start at: `http://localhost:5000`

---

## 📡 API Endpoints Documentation

### 1. Root & Health Check
- `GET /` - API welcome information and endpoints manifest.
- `GET /api/health` - Health check reporting uptime and memory stats.

---

### 2. Authentication Endpoints (`/api/auth`)

#### A. Register New Farmer / User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "Ramesh Patel",
  "email": "ramesh.patel@kisan.in",
  "password": "FarmerSecurePass123",
  "phoneNumber": "9876543210",
  "userRole": "farmer",
  "language_preference": "Hindi"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8...",
    "fullName": "Ramesh Patel",
    "email": "ramesh.patel@kisan.in",
    "phoneNumber": "9876543210",
    "userRole": "farmer",
    "language_preference": "Hindi"
  }
}
```

#### B. Login
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "ramesh.patel@kisan.in",
  "password": "FarmerSecurePass123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8...",
    "fullName": "Ramesh Patel",
    "email": "ramesh.patel@kisan.in"
  }
}
```

#### C. Get Current Authenticated Profile
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Access**: Private (Header: `Authorization: Bearer <token>`)

---

### 3. Farmer Profile Endpoints (`/api/farmer`)
*All endpoints require the `Authorization: Bearer <token>` header.*

#### A. Create Profile
- **Method**: `POST`
- **URL**: `/api/farmer/profile`
- **Request Body**:
```json
{
  "location": {
    "latitude": 26.8467,
    "longitude": 80.9462,
    "state": "Uttar Pradesh",
    "district": "Lucknow"
  },
  "farmSize": 5.5,
  "soilType": "alluvial",
  "waterAvailability": "irrigated",
  "cropsGrown": [
    {
      "cropName": "Wheat (Kundan)",
      "season": "Rabi",
      "areaInAcres": 3.5
    },
    {
      "cropName": "Mustard (Pusa)",
      "season": "Rabi",
      "areaInAcres": 2.0
    }
  ]
}
```
- **Response (201 Created)**: Returns created farmer profile and `completionScore`.

#### B. Get Current Logged-in Farmer Profile
- **Method**: `GET`
- **URL**: `/api/farmer/me`

#### C. Get Profile by ID
- **Method**: `GET`
- **URL**: `/api/farmer/profile/:farmerId`

#### D. Update Profile
- **Method**: `PUT`
- **URL**: `/api/farmer/profile/:farmerId`

#### E. Profile Completion Analytics
- **Method**: `GET`
- **URL**: `/api/farmer/profile/:farmerId/completion`
- **Response (200 OK)**:
```json
{
  "success": true,
  "farmerId": "673f8...",
  "completionPercentage": 100,
  "isComplete": true,
  "missingFields": [],
  "actionableTips": "All farm parameters are filled. Personalized agricultural intelligence is fully enabled!"
}
```

---

### 4. Weather & Agricultural Advisory Endpoints (`/api/weather`)

#### Get Weather & Crop Recommendations by Coordinates
- **Method**: `GET`
- **URL**: `/api/weather/:lat/:long` (e.g. `/api/weather/28.6139/77.2090`)
- **Access**: Public
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Weather forecast and agricultural recommendations retrieved successfully.",
  "cached": false,
  "cacheSource": "fresh-api-call",
  "data": {
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "city": "Delhi NCR",
      "country": "IN"
    },
    "currentWeather": {
      "temperature": {
        "current": 29,
        "feelsLike": 30,
        "min": 24,
        "max": 33,
        "unit": "Celsius"
      },
      "humidity": 58,
      "wind": {
        "speed": 3.2,
        "speedKmph": 12,
        "direction": 120
      },
      "condition": "Clear",
      "rainPossibility": 0
    },
    "agriculturalAdvisory": [
      {
        "category": "Irrigation",
        "priority": "NORMAL",
        "advice": "Optimal weather for standard crop irrigation based on crop stage.",
        "hindiAdvice": "फसल की अवस्था के अनुसार सामान्य सिंचाई के लिए अनुकूल मौसम है।"
      },
      {
        "category": "Spraying",
        "priority": "NORMAL",
        "advice": "Wind speed is calm (<15 km/h). Ideal window for pesticide or micro-nutrient spraying.",
        "hindiAdvice": "हवा शांत है। कीटनाशक या सूक्ष्म पोषक तत्वों के छिड़काव के लिए उपयुक्त समय है।"
      }
    ]
  }
}
```

---

## 🎓 Viva Questions & Answers Guide for College Evaluators

When explaining this project to teachers, evaluators, or in viva interviews, use these concepts:

### Q1. Why did you choose Node.js and Express for the backend?
> **Answer**: Node.js utilizes an asynchronous, event-driven, single-threaded I/O model based on Google Chrome's V8 engine. It excels at handling concurrent I/O operations (such as querying weather APIs, database reads/writes) with minimal RAM overhead. Express.js provides a minimalist, robust routing and middleware architecture.

### Q2. How does JWT authentication work and why is it preferred over traditional session cookies?
> **Answer**: JWT (JSON Web Token) provides **stateless authentication**. When a farmer logs in, the server signs a token containing `{ id: user._id }` using a server secret (`JWT_SECRET`). The client sends this token in the `Authorization: Bearer <token>` header for subsequent requests. Because the token is self-contained and cryptographically signed, the server does not need to store active session IDs in database memory, making horizontal scaling easy.

### Q3. Why use a pre-save hook for password hashing in Mongoose?
> **Answer**: Using `userSchema.pre('save')` encapsulates the password hashing logic directly into the model layer. Whenever a user registers or updates their password, `bcrypt.genSalt(10)` and `bcrypt.hash()` execute automatically before the document reaches the MongoDB engine. This ensures passwords are never saved in plaintext, regardless of where in the application `.save()` is triggered.

### Q4. Why is weather data cached in memory for 30 minutes?
> **Answer**: Meteorological parameters (temperature, humidity, atmospheric pressure) change gradually over hours, not milliseconds. Caching coordinates for 30 minutes (`node-cache`):
> 1. Drastically reduces third-party API costs and prevents hitting OpenWeatherMap rate limits.
> 2. Reduces response latency from ~500ms (network call) to <1ms (RAM lookup).
> 3. Guarantees high availability even during transient network spikes.

### Q5. How does your system convert weather data into agricultural advisories?
> **Answer**: Raw weather metrics are parsed through an agro-meteorological rule engine (`mapWeatherToRecommendations` in `weatherService.js`). For example:
> - **High wind (>15 km/h)**: Advises farmers to stop spraying pesticides to prevent drift.
> - **High humidity (>75%) + Warm temp (24-32°C)**: Triggers fungal blight alerts and pest monitoring.
> - **Rain forecast**: Advises postponing irrigation to prevent waterlogging and fertilizer wastage.

---

## 📌 Day 2 Core Features Overview

During **Day 2**, the following modules were implemented and integrated:
1. **Crop Recommendation Engine (`/api/crops`)**: Multi-variable ranking factoring in season, soil type, temperature, and net profitability.
2. **Soil Health & Fertilizer Calculator (`/api/soil`)**: Lab test evaluation with exact Urea (45kg), DAP (50kg), and MOP (50kg) bag calculations for farm acreage.
3. **Pest & Disease Detection (`/api/pest`)**: Image uploads via Multer, symptom pattern matching, and dual organic/chemical treatment costing.
4. **Mandi Market Prices & Alerts (`/api/market`)**: Wholesale APMC commodity rates, 30-day volatility trends, buy/sell timing intelligence, and custom price alerts.
5. **Admin Analytics Dashboard (`/api/admin`)**: Executive metrics, top recommended crops, regional farmer breakdowns, and pest outbreak maps.
6. **Feedback & Rating System (`/api/feedback`)**: 1-5 star ratings and feedback collection.
7. **Comprehensive Postman Collection**: Ready-to-import `postman_collection.json` with pre-configured requests.

---

## 🎨 Day 3 - Frontend & Deployment Suite

During **Day 3**, the complete production-grade React web client and deployment infrastructure were delivered:

### 1. Modern React + Vite Frontend (`/frontend`)
- **8 Production Pages**:
  1. `Login` (`/login`): Farmer and Admin authentication with demo credentials quick-fill.
  2. `Register` (`/register`): Role selection, state/district, soil categorization, and irrigation details.
  3. `Dashboard` (`/`): Real-time agro-meteorological advisories, profile completion meter, crop matches, Mandi price preview, and soil diagnostics.
  4. `Crop Recommendations` (`/crops`): Filter by season (*Kharif, Rabi, Zaid*), sort by profit/yield, text-to-speech audio readouts, and detailed agronomic modal guides.
  5. `Soil Health & Fertilizer Calculator` (`/soil`): Laboratory NPK gauge diagnostics, 3-year historical line chart (`react-chartjs-2`), exact commercial fertilizer bag calculations (Urea 45kg, DAP 50kg, MOP 50kg) with estimated cost, and testing reminders.
  6. `Pest & Disease Detection` (`/pest`): Drag-and-drop leaf photo uploader, live camera viewfinder snapshot capture, dual organic vs. chemical remedy recommendations, and per-acre treatment costing.
  7. `Mandi Market Rates & Intelligence` (`/market`): Real-time APMC wholesale rates, voice search for commodities, 30-day price trend chart, buy/sell timing signals, SMS/Push alert setup, and CSV export.
  8. `Settings & Profile` (`/settings`): Farm profile updater, password change, English/Hindi language switch, and Dark/Light mode theme toggle.

### 2. Voice & Multilingual Support
- **Web Speech API Integration**:
  - **Speech-to-Text (STT)**: Hands-free voice recognition for searching crops and Mandi markets.
  - **Text-to-Speech (TTS)**: Bilingual audio playback (`en-IN` and `hi-IN`) reading agronomic advisories and sell recommendations aloud for rural farmers.
- **i18next Multilingual Engine**: Full UI translation between English and Hindi (`en.json` & `hi.json`) with persistent user preference in `localStorage`.

### 3. Docker Containerization & Deployment Orchestration
- **Root Dockerfile**: Production Node.js 20-alpine container with health check on `http://localhost:5000/api/health`.
- **Frontend Dockerfile & Nginx**: Multi-stage build (Node build -> Nginx Alpine static server with reverse proxy for `/api/` and `/uploads/`).
- **Docker Compose (`docker-compose.yml`)**: Single-command multi-container stack (`backend`, `frontend`, `mongodb`) with persistent volumes and bridge networking:
  ```bash
  docker-compose up --build
  ```
- **Cloud Deployment Support**:
  - Heroku / Railway: `Procfile` ready (`web: node src/server.js`).
  - Environment templates: `.env.development`, `.env.production`.

---

## 📜 Git Version History
- `b47cc8d` - Initial commit (Repository initialization)
- `Day 1` - Backend infrastructure, authentication, farmer profile & weather advisory system
- `Day 2` - Crop recommendations, soil health, fertilizer dosage, pest detection, mandi prices & admin analytics
- `Day 3` - React Vite frontend, Web Speech API (STT/TTS), i18n bilingual support (EN/HI), Docker orchestration & deployment configs


