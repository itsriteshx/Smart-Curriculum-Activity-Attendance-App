# 🌾 KisanSeva - Smart Agricultural Advisory System (Terminal Application)

[![Project Status: Completed](https://img.shields.io/badge/Project%20Status-Completed-success?style=for-the-badge)](https://github.com/itsriteshx/Smart-Curriculum-Activity-Attendance-App)
[![Platform: Terminal CLI](https://img.shields.io/badge/Platform-Terminal%20CLI-blue?style=for-the-badge)](https://github.com/itsriteshx/Smart-Curriculum-Activity-Attendance-App)
[![Tests: 12/12 Passing](https://img.shields.io/badge/Tests-12%2F12%20Passing-brightgreen?style=for-the-badge)](https://github.com/itsriteshx/Smart-Curriculum-Activity-Attendance-App)
[![Language: Node.js](https://img.shields.io/badge/Runtime-Node.js%20v18%2B-green?style=for-the-badge)](https://nodejs.org)

**Portal Project Title:** Smart Curriculum Activity & Attendance App  
**Domain & Technology Bucket:** Smart Agriculture / Terminal Application  
**Student Name:** Ritesh Kumar  
**University / Institute:** Ajeenkya DY Patil University (ADYPU)  
**URN:** E25B070681 | **Email:** e25b070681@adypu.edu.in  

---

## 📖 Executive Summary & Problem Context

In India, over **86% of farmers are small and marginal** (NABARD Report, 2022). Due to digital literacy barriers, language gaps, and the absence of localized scientific tools, a majority of farmers rely on guesswork or local shopkeeper recommendations for:
- Crop selection
- Chemical fertilizer dosages
- Pest and disease control
- Selling timing in local Mandis

This often leads to poor crop yields, soil degradation, excessive input costs, and exploitation. Studies demonstrate that **scientific, ICT-based advisories can increase farm yields by 20% to 30%** while cutting unnecessary input costs.

**KisanSeva** is a lightweight, zero-latency **Terminal Application (CLI)** designed to provide personalized, real-time agronomic insights directly inside the terminal without requiring heavy web browsers or high-speed broadband connections.

---

## 🚀 Quick Start (Running the Terminal App)

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- Any standard Terminal (macOS Terminal, iTerm, Linux Bash/Zsh, Windows PowerShell)

### 2. Installation & Launch
```bash
# Clone the repository
git clone https://github.com/itsriteshx/Smart-Curriculum-Activity-Attendance-App.git
cd Smart-Curriculum-Activity-Attendance-App

# Install dependencies
npm install

# Launch the Interactive Terminal Application
npm start
```

*(You can also run directly with `node cli.js`)*

---

## 🎮 Features & Problem Statement Alignment

| # | Expected Outcome | Terminal CLI Module | Technical Implementation |
|---|---|---|---|
| **1** | **Location & Soil Crop Advisory** | `1. 🌾 Smart Crop Recommendation` | Evaluates Season (30%), Soil Type (25%), Temperature (20%), Hydrology (15%), and Net Profitability (10%) to rank suitable crops. |
| **2** | **Soil Health & Fertilizer Guidance** | `2. 🧪 Soil Health & Fertilizer Calculator` | Converts NPK soil test deficits into exact commercial bag counts for **Urea (45kg)**, **DAP (50kg)**, and **MOP (50kg)** with subsidized cost estimates. |
| **3** | **Weather Alerts & Insights** | `3. 🌦️ Weather-Based Farm Advisory` | Agro-meteorological decision matrix evaluates rain probability (irrigation postponement) and wind velocity (safe spraying window). |
| **4** | **Pest & Disease Detection** | `4. 🐛 Pest & Disease Diagnosis` | Symptom matching engine returning confirmed pathogen, confidence %, and both **Organic (Bio)** & **Chemical** treatments. |
| **5** | **Market Price Tracking** | `5. 📈 Mandi Market Prices & Advisory` | Tracks APMC mandi rates across states, compares modal prices against MSP, and delivers clear **SELL** or **HOLD** advice. |
| **6** | **Multilingual Support** | `6. 🌐 Switch Language (हिन्दी / English)` | Full bilingual support with instant toggle between English and Hindi. |
| **7** | **Feedback & Continuous Improvement** | `7. 📝 Farmer Feedback Survey` | Collects 1-5 star ratings and reviews, persisting them into `feedback_log.json` for audit. |
| **8** | **System Architecture & Viva Guide** | `8. 📊 System Overview & Viva Guide` | In-terminal documentation displaying formulas, data structures, and Viva explanation points. |

---

## 🧮 Core Algorithms & Agronomic Formulas

### 1. Scientific Fertilizer Requirement Engine
Commercial fertilizers do not contain pure elemental nutrients. The application computes required bags using verified chemical compositions:
- **DAP (Diammonium Phosphate - 18:46:0):** Supplies 46% $P_2O_5$ and 18% Nitrogen:
  $$\text{DAP Required (kg)} = \frac{\text{Phosphorus Deficit}}{0.46}$$
  $$\text{Nitrogen supplied by DAP} = \text{DAP (kg)} \times 0.18$$
- **Urea (46% Nitrogen):** Supplies remaining Nitrogen:
  $$\text{Urea Required (kg)} = \frac{\text{Nitrogen Deficit} - \text{N from DAP}}{0.46}$$
- **MOP (Muriate of Potash - 60% $K_2O$):** Supplies Potassium:
  $$\text{MOP Required (kg)} = \frac{\text{Potassium Deficit}}{0.60}$$

### 2. Multi-Criteria Crop Suitability Index
Every candidate crop is evaluated against 5 weighted criteria:
$$\text{Score} = w_{\text{season}} + w_{\text{soil}} + w_{\text{temp}} + w_{\text{water}} + w_{\text{profit}} \quad (\text{Max: } 100)$$

### 3. Weather Decision Matrix
- $\text{Rain Probability} > 50\% \implies$ **Postpone flood irrigation** (prevents waterlogging and fertilizer leaching).
- $\text{Wind Speed} < 12\text{ km/h} \ \& \ \text{Rain} < 40\% \implies$ **Optimal foliar spray window** (avoids wind drift).
- $\text{Humidity} > 70\% \implies$ **Fungal blight risk alert** (Paddy/Pulses).

---

## 📂 Project Architecture

```text
Smart-Curriculum-Activity-Attendance-App/
├── cli.js                  # 🌟 Main Terminal Application (Interactive CLI)
├── README.md               # 📖 Master Project Documentation
├── package.json            # ⚙️ Project configuration, scripts, and bin alias
├── test-api.js             # 🧪 Day 1 Verification Suite (6 Automated Tests)
├── test-day2.js            # 🧪 Day 2 Verification Suite (6 Automated Tests)
├── feedback_log.json       # 📝 Local audit log for farmer feedback
└── src/
    ├── server.js           # Express API server (optional backend service)
    ├── config/
    │   └── db.js           # MongoDB connection handler
    ├── constants/
    │   ├── roles.js        # Agricultural enums (Soil types, seasons, roles)
    │   └── messages.js     # Standardized response messages
    ├── models/             # Mongoose schemas (User, Farmer, Crop, Fertilizer)
    ├── middleware/         # Auth, validation, and error middlewares
    ├── controllers/        # Business logic controllers
    ├── services/
    │   ├── fertilizerService.js     # Exact bag calculation algorithm
    │   ├── recommendationEngine.js  # Crop scoring and ranking engine
    │   ├── pestClassification.js    # Symptom diagnosis engine
    │   └── weatherService.js        # Weather parsing & caching
    └── utils/
        ├── seedData.js     # Master agronomic catalog (crops, pests, mandis)
        └── validators.js   # Input validation helpers
```

---

## 🧪 Automated Testing & Verification

The project includes 12 automated verification suites covering all agronomic rules, calculations, and algorithms.

To run all verification suites:
```bash
npm test
```

### Verification Output:
```text
🧪 Starting Day 1 Automated Verification Suite...
✅ Test 1 Passed: System constants verified.
✅ Test 2 Passed: Bcrypt hashing and comparison functional.
✅ Test 3 Passed: Weather parser successfully extracts and formats metrics.
✅ Test 4 Passed: Agricultural decision engine generated proper rain advisory & Hindi translations.
✅ Test 5 Passed: In-memory cache successfully served repeated coordinate requests.
✅ Test 6 Passed: Profile completion score calculated: 100%.
🎉 ALL 6 TEST SUITES PASSED SUCCESSFULLY!

🧪 Starting Day 2 Core Agricultural Features Verification Suite...
✅ Test 1 Passed: Crop catalog verified for Kharif season.
✅ Test 2 Passed: 4-Acre Fertilizer Plan: 3 Urea bags, 3 DAP bags, 2 MOP bags. Total: ₹8250
✅ Test 3 Passed: Diagnosed 'Yellow Rust / Stripe Rust' with 94% confidence.
✅ Test 4 Passed: Mandi trend generated across 30 days. Price band: ₹2340 - ₹2568/quintal.
✅ Test 5 Passed: Role-based access control strictly enforced for admin routes.
✅ Test 6 Passed: Complete seed datasets loaded for Crops, Fertilizers, Pests, and Mandis.
🎉 ALL 6 DAY 2 VERIFICATION TEST SUITES PASSED SUCCESSFULLY!
```

---

---

## 👤 Author & Academic Details

- **Student:** Ritesh Kumar
- **URN:** E25B070681
- **Institute:** Ajeenkya DY Patil University (ADYPU), Pune
- **Repository:** [https://github.com/itsriteshx/Smart-Curriculum-Activity-Attendance-App](https://github.com/itsriteshx/Smart-Curriculum-Activity-Attendance-App)
- **License:** ISC
