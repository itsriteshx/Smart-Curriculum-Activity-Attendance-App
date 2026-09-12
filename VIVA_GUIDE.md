# 🎓 KisanSeva - Terminal Application: Viva Preparation & Architecture Guide
**Student Name:** Ritesh Kumar  
**URN:** E25B070681 | **Institute:** ADYPU  
**Project:** Smart Curriculum Activity & Attendance App / Smart Agricultural Advisory System  
**Interface Type:** Interactive Terminal Application (CLI)

---

## 📌 1. Project Background & Problem Statement (What to say first)
> *"Sir/Ma'am, in India, over 86% of farmers are small and marginal (NABARD 2022 Report). Most of them rely on guesswork or local shopkeeper recommendations, leading to excessive chemical fertilizer use, soil degradation, and low crop yields.  
> Our project is a **Terminal Application (CLI)** that provides zero-latency, scientific, and actionable agricultural advisories directly to farmers in English and Hindi without requiring high-speed internet or complex apps."*

---

## 🎯 2. Expected Outcomes & Code Implementation

| Expected Outcome (From Problem Statement) | Module in `cli.js` | How It Works |
|---|---|---|
| **1. Location & Soil Crop Advisory** | `handleCropRecommendation()` | Multi-factor scoring algorithm evaluating Season (30%), Soil (25%), Temp (20%), Water (15%), Profit (10%). |
| **2. Soil Health & Fertilizer Guidance** | `handleSoilAndFertilizer()` | Calculates exact bags of Urea, DAP, and MOP required based on NPK soil deficits. |
| **3. Weather-based Alerts & Insights** | `handleWeatherAdvisory()` | Evaluates rain probability and wind speed to recommend irrigation timing and safe spraying windows. |
| **4. Pest / Disease Detection** | `handlePestDiagnosis()` | Matches observed leaf/stem symptoms with pathogen database, outputs confidence %, organic remedy & chemical remedy. |
| **5. Market Price Tracking** | `handleMarketPrices()` | Compares APMC mandi modal rates with government MSP and delivers SELL or HOLD advice. |
| **6. Multilingual Support** | `currentLang` toggle | Full English and Hindi (हिन्दी) bilingual interface. |
| **7. Feedback & Data Collection** | `handleFeedback()` | Collects 1-5 star ratings and reviews, persisting them into `feedback_log.json`. |

---

## 🧮 3. Key Formulas & Algorithms (Explain in Viva)

### A. Fertilizer Dosage Formula:
1. **DAP (Diammonium Phosphate - 18:46:0):**
   - Supplies all required Phosphorus: `DAP (kg) = Phosphorus Deficit / 0.46`
   - Also supplies Nitrogen: `N from DAP = DAP (kg) × 0.18`
2. **Urea (46% Nitrogen):**
   - Supplies remaining Nitrogen: `Urea (kg) = (Total N Deficit - N from DAP) / 0.46`
3. **MOP (Muriate of Potash - 60% K₂O):**
   - Supplies Potassium: `MOP (kg) = Potassium Deficit / 0.60`
4. **Bag Conversions:**
   - Urea = 45 kg bag (₹266.5/bag)
   - DAP = 50 kg bag (₹1,350/bag)
   - MOP = 50 kg bag (₹1,700/bag)

### B. Weather Advisory Decision Matrix:
- **Rain Probability > 50%:** Alert farmer to **POSTPONE irrigation** to prevent waterlogging and chemical leaching.
- **Wind Speed < 12 km/h & Rain < 40%:** **SAFE SPRAY WINDOW** for foliar nutrients and pesticides (avoids wind drift).
- **Relative Humidity > 70%:** **FUNGAL DISEASE RISK** alert (Blight / Rust).

### C. Mandi Sell vs Hold Decision Logic:
- If current modal price > 5% above 30-day base rate: **HOLD / PARTIAL SELL** (sell 30% for liquidity, hold 70% for market peak).
- If price is falling or near minimum: **SELL AT APMC / MSP** to avoid distress loss.

---

## 💡 4. Top 5 Viva Questions & Short Answers

**Q1: Why did you build a Terminal Application instead of just a website?**  
> *"In rural areas, farmers and field extension officers often have low-bandwidth connectivity and low-spec hardware. A lightweight Terminal Application starts instantly in under 100 milliseconds, requires zero browser memory, and can run over lightweight remote SSH connections or low-cost Linux terminals (like Raspberry Pi in Krishi Vigyan Kendras)."*

**Q2: What technologies did you use for the Terminal Application?**  
> *"We used Node.js with the built-in `readline` module for interactive prompts, standard ANSI escape codes for rich terminal styling and colors, and JSON-based file persistence for storing farmer feedback and diagnostics."*

**Q3: How does the crop recommendation algorithm work?**  
> *"It uses a weighted multi-criteria decision index: Season alignment contributes 30 points, Soil type match contributes 25 points, Temperature tolerance contributes 20 points, Farm irrigation capacity contributes 15 points, and Net economic profit per acre contributes 10 points. Crops with the highest aggregate score out of 100 are ranked first."*

**Q4: How do you prevent chemical fertilizer overuse?**  
> *"By reading actual soil lab test values (Nitrogen, Phosphorus, Potassium in kg/ha) and subtracting them from national soil benchmarks (280 kg/ha for N, 25 kg/ha for P, 180 kg/ha for K). We calculate exact kilograms needed rather than relying on arbitrary shopkeeper recommendations."*

**Q5: How can this application scale in the future?**  
> *"We can integrate automated SMS alerts via Twilio or Indian Government's Kisan SMS Portal, connect to real-time e-NAM (National Agriculture Market) APIs, and integrate computer vision models using TensorFlow for automatic leaf image diagnosis."*
