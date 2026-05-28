# 🎓 CoStudy: Real-Time Collaborative Study Room Platform

CoStudy is a web-based, collaborative virtual ecosystem built to help students and developers combat isolation during long prep sessions. The platform provides structured, distraction-free environments featuring synchronized accountability tools, deep-work telemetry, and instant peer-to-peer communication channels.

---

## 🛠️ Tech Stack Architecture

The application is built using a complete decoupled **MERN Stack** architecture running separate frontend and backend servers:

### Frontend Ecosystem
* **Core Library:** React 19 (Built using the high-performance Vite compiler)
* **Styling Engine:** Tailwind CSS v4 Engine (Native CSS customization layer)
* **Communication:** Socket.io-Client (State synchronization)
* **Network Client:** Native Fetch Framework

### Backend Infrastructure
* **Runtime:** Node.js 
* **Web Framework:** Express.js (Modular component-based routing)
* **Database Engine:** MongoDB & Mongoose ODM
* **Real-time Engine:** Socket.io (WebSocket event framework)
* **Security Protocol:** JSON Web Tokens (JWT) & BcryptJS password hashing

---

## 🚀 Core Features Implemented

* **Secure Authentication Module:** Clean Registration and Login routes backed by salted password hashing (`bcryptjs`) and secure state management using state-locked JWT payloads.
* **Workspace Management Panel:** Dynamic component-driven engine enabling users to instantly spin up separate study hubs with metadata, rendering active occupant metrics globally.
* **Real-Time State-Synced Focus Timer:** Peer-to-peer synchronized countdown timer built on WebSocket event rooms. Starting, pausing, or altering intervals triggers unified updates for everyone inside the room.
* **Automated Analytical Logging Dashboard:** When focus sessions run to completion, the platform pushes structural telemetry metrics directly to the MongoDB backend to persist historical data logs.
* **Encapsulated Clean Communication Feed:** Live, lightweight chatting utility featuring targeted data scoping. Text nodes append instantly without affecting global layout performance.

---

## 📂 Project Directory Layout

```text
study-room-platform/
├── backend/
│   ├── config/          # Database driver configuration
│   ├── controllers/     # Independent endpoint request logic handlers
│   ├── models/          # Structural Mongoose schemas (User, Room)
│   ├── routes/          # Express route registration maps
│   ├── .env             # Environment infrastructure maps (Ignored in VCS)
│   ├── package.json     # Node runtime dependency manifest
│   └── server.js        # App orchestration gateway & WebSocket socket engine
└── frontend/
    ├── src/
    │   ├── components/  # Modular presentation components (Dashboard, StudyRoom)
    │   ├── App.jsx      # High-order layout orchestration & Auth gating
    │   ├── index.css    # Unified Tailwind CSS v4 configurations
    │   └── index.jsx    # Hard-mount injection root element entry point
    ├── index.html       # Single Page Application skeleton
    ├── vite.config.js   # Fast bundling configuration properties
    └── package.json     # Client application package registry manifest
