# 🚍 NextMove

> A real-time transport intelligence platform with predictive ETA, crowd awareness, and offline support—designed for low-connectivity cities.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox)

---

## ✨ Overview

NextMove is a smart public transport platform that combines real-time tracking with predictive intelligence to deliver a seamless commuting experience. The system provides live bus tracking, ETA and crowd predictions, multimodal route assistance, and reliable offline support for users in low-connectivity environments.

---

## 🌟 Features

### 🚍 Real-Time Bus Tracking
- Live bus location updates using Socket.IO
- Uber-like tracking experience
- Dynamic bus markers on Mapbox

### ⏱️ Predictive ETA
- Traffic-aware ETA calculation
- TomTom/HERE traffic integration
- Fallback ETA estimation when APIs fail

### 👥 Crowd Intelligence
- Time-based crowd prediction
- Feedback-driven accuracy improvements
- Crowd level visualization

### 📶 Offline-First Support
- Cached schedules using IndexedDB
- AI fallback predictions
- Static route assistance without internet

### 🔄 Adaptive Network Handling
- WebSocket updates on strong networks
- Polling on weak connections
- Offline mode using cache and predictions

### 🔔 Smart Alerts
- Nearby bus notifications
- Device vibration alerts
- Arrival reminders

### 📊 Admin Dashboard
- Live bus monitoring
- Delay analytics
- Crowd trend analysis
- Transit optimization insights

---

## 🛠️ Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React, Mapbox GL JS |
| Backend | Node.js, Express.js |
| Realtime | Socket.IO |
| Database | Supabase (PostgreSQL) |
| Offline Storage | IndexedDB |
| Analytics | Chart.js |
| Traffic APIs | TomTom / HERE |
| Animations | Framer Motion |

---

## 🏗️ Architecture

```text
User
 │
 ▼
React Frontend
 │
 ├── Mapbox UI
 ├── IndexedDB Cache
 └── Socket.IO Client
        │
        ▼
Node.js + Express Backend
        │
 ├── Route Engine
 ├── ETA Prediction
 ├── Crowd Prediction
 ├── Feedback Service
 └── Analytics Engine
        │
        ▼
Supabase Database
```

---

## 🔄 User Flow

```text
Open App
   ↓
Detect User Location
   ↓
Search Destination
   ↓
Calculate Routes
   ↓
Predict ETA & Crowd
   ↓
Select Transport Option
   ↓
Live Tracking or Offline Prediction
   ↓
Collect User Feedback
   ↓
Generate Admin Insights
```

---

## 🧠 AI Layer

### ETA Prediction

```javascript
ETA = BaseTime × TrafficFactor
```

Uses:
- Traffic API data
- Historical timing patterns
- Fallback heuristics

### Crowd Prediction

```javascript
Crowd = BasePrediction + Average(UserFeedback)
```

Uses:
- Peak-hour logic
- Community feedback

---

## 📶 Offline Experience

Even without internet connectivity, users can:

- Access cached schedules
- View predicted delays
- Receive fallback ETA estimates
- Continue route assistance

---

## 📊 Admin Dashboard

The dashboard enables administrators to:

- Monitor live buses
- Analyze delays by route
- Detect crowd hotspots
- Identify peak travel periods
- Recommend operational improvements

Example Insight:

> "Add more buses at 9 AM."

---

## 🚀 Future Enhancements

- GTFS integration
- Push notifications
- Machine learning ETA models
- Government transport API integration
- Native mobile applications

---

## 👨‍💻 Author

**Mohit Singh**

Backend-Focused Full Stack Developer passionate about building scalable systems and solving real-world problems through technology.

---

> **"A real-time transport system with predictive timing and crowd awareness, designed specifically for low-connectivity cities."**
