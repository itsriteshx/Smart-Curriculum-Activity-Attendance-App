# 🌾 Smart Agricultural Advisory System - API Documentation

A complete reference guide for all REST endpoints across Day 1 and Day 2 deliverables.

---

## 1. System Health & Metadata
- `GET /` - Root discovery endpoint listing all active endpoints.
- `GET /api/health` - Telemetry health check returning uptime and memory stats.

---

## 2. Authentication (`/api/auth`)
- `POST /api/auth/register` - Create farmer/officer/admin account.
- `POST /api/auth/login` - Authenticate and obtain JWT token.
- `POST /api/auth/logout` - Logout acknowledgment.
- `GET /api/auth/me` - Authenticated user profile (Header: `Authorization: Bearer <token>`).

---

## 3. Farmer Profile (`/api/farmer`)
- `POST /api/farmer/profile` - Create digital farm record.
- `GET /api/farmer/me` - Current logged-in farmer profile.
- `GET /api/farmer/profile/:farmerId` - Profile lookup.
- `PUT /api/farmer/profile/:farmerId` - Update farm parameters.
- `GET /api/farmer/profile/:farmerId/completion` - Profile completeness percentage.

---

## 4. Weather & Agro-Meteorological Advisories (`/api/weather`)
- `GET /api/weather/:lat/:long` - Real-time weather, 30m cached response, and agro advisories.

---

## 5. Crop Recommendation Engine (`/api/crops`)
- `GET /api/crops/recommend/:farmerId` - Generates top 5 recommended crops based on season, soil, temperature, and profitability.
- `GET /api/crops/:cropId` - Full agronomic parameters for a crop.
- `GET /api/crops/region/:state/:district` - Crops suitable for specific state.
- `GET /api/crops/seasonal/:season` - Crops suitable for Kharif, Rabi, or Zaid.

---

## 6. Soil Health & Fertilizer Calculator (`/api/soil`)
- `POST /api/soil/analyze` - Upload NPK and pH readings, calculate deficiency status.
- `GET /api/soil/analysis/:farmerId` - Historical soil test timeline.
- `GET /api/soil/fertilizer-recommendation/:farmerId/:cropId` - Exact Urea (45kg), DAP (50kg), MOP (50kg) bags required.
- `POST /api/soil/set-reminder/:farmerId` - Set annual 365-day re-test reminder.

---

## 7. Pest & Disease Diagnostics (`/api/pest`)
- `POST /api/pest/detect` - Upload crop leaf photograph (multipart `image`), AI pattern matching diagnosis.
- `GET /api/pest/treatment/:pestId/:cropId` - Organic biological + chemical remedies.
- `GET /api/pest/cost/:pestName/:farmSize` - Spraying and treatment expense for farm size.
- `GET /api/pest/history/:farmerId` - Past diagnoses.
- `POST /api/pest/report` - Manual symptom log.

---

## 8. Mandi Market Prices & Alerts (`/api/market`)
- `GET /api/market/prices/:cropName/:state/:district` - Wholesale APMC mandi price per quintal.
- `GET /api/market/history/:cropName?days=30` - 7d, 30d, 1-year historical price trends.
- `GET /api/market/sell-recommendation/:cropName/:farmerId` - Buy/sell decision intelligence.
- `POST /api/market/alert/create` - Subscribe to price alert.
- `GET /api/market/alert/:farmerId` - View farmer's alerts.
- `PUT /api/market/alert/:alertId` - Toggle alert status.

---

## 9. Admin Analytics (`/api/admin`) *(Admin Role Only)*
- `GET /api/admin/stats` - Macro analytics overview.
- `GET /api/admin/farmers/count` - Regional farmer distribution.
- `GET /api/admin/crops/recommendations` - Top crop recommendation statistics.
- `GET /api/admin/pests/common` - Active pest outbreaks and hot-spots.

---

## 10. Feedback & Ratings (`/api/feedback`)
- `POST /api/feedback` - Submit farmer rating and feedback.
- `GET /api/feedback/stats` - Admin overview of satisfaction ratings.
