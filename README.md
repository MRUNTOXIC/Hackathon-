# Hackathon Management System 2026

A comprehensive, full-stack ecosystem for managing hackathons. Built with Next.js 15, TypeScript, and MongoDB Atlas.

## 🚀 Overview

This repository contains three main components of the Hackathon ecosystem:

1.  **[HackDash (Main Dashboard)](./hackathon-dashboard)**: A centralized hub for participants and organizers.
    *   **Participants**: Team management, project submission, and internet credentials.
    *   **Admin**: Real-time stats, participant management, and announcements.
2.  **[Judge Web App](./judge-web-app)**: A standalone PWA for judges to evaluate teams on mobile/tablet.
    *   Round 1 & Round 2 evaluation.
    *   6-parameter scoring model with innovation, UI/UX, and technical metrics.
4.  **[Scanner App](./scanner-app)**: Mobile app for organizers.
    *   **Backend**: Uses a standalone Express API on port 5001.

---

## 🛠 Tech Stack

*   **Frontend**: Next.js 15 (Turbopack), React 19, Tailwind CSS 4, Expo (Mobile).
*   **Backend**: Next.js API Route Handlers & Express.js.
*   **Database**: MongoDB Atlas with Mongoose ODM.

---

## 📦 Getting Started

### 1. Prerequisites
*   Node.js 20+
*   MongoDB Atlas cluster

### 2. Environment Setup
Create a `.env.local` file in `hackathon-dashboard` and `judge-web-app`, and a `.env` file in `backend`.

#### **Scanner Backend (.env)**
```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
MONGO_DB=hackathonDB
```

### 3. Running the Apps

#### **Main Dashboard**
```bash
cd hackathon-dashboard
npm run dev
```

#### **Scanner Backend**
```bash
cd backend
npm start
```

#### **Scanner App (Mobile)**
```bash
cd scanner-app
npx expo start
```

#### **Landing Website**
```bash
cd hackathon-website
npm install
npm run dev
```

---

## 📱 Mobile Access

To access the dashboards or Judge App on your smartphone for testing:
1.  Ensure your phone and computer are on the **same WiFi**.
2.  Identify your local IP address (e.g., `192.168.1.100`).
3.  Open the apps via:
    *   **Dashboard**: `http://192.168.1.100:4001`
    *   **Judge App**: `http://192.168.1.100:4002`

---

## ✨ Key Features

*   **PWA Support**: All apps are installable to your home screen.
*   **Auto-Refresh**: Real-time data synchronization every 60 seconds.
*   **Persistent Login**: One-time login lasts for 7 days with instant restoration.
*   **Mobile-Friendly**: Fully responsive layouts optimized for all screen sizes.
*   **Integrated API**: Consolidated backend logic within Next.js for high performance and low latency.
