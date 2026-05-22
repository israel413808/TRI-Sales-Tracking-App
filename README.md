# TRI Sales KPI Tracking App

A real-time sales performance tracking application built with React and Firebase.

## Features

- **Sales Rep Dashboard**: Submit end-of-day (EOD) reports with metrics (dials, pitches, sales, I AM standards)
- **CSO Dashboard**: View team performance metrics and filter by individual reps
- **Real-time Sync**: Firebase Firestore ensures instant data updates
- **Role-based Access**: Automatic routing based on email (CSO emails contain "israel")

## Quick Start

### Prerequisites
- Node.js (v14+)
- Git
- GitHub Account

### Installation

1. **Clone your GitHub repository**
   ```bash
   git clone https://github.com/israel413808/TRI-Sales-Tracking-App.git
   cd TRI-Sales-Tracking-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally (optional)**
   ```bash
   npm start
   ```
   Opens http://localhost:3000

4. **Build for deployment**
   ```bash
   npm run build
   ```

### Deployment to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add the 6 Firebase environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`
5. Click Deploy

## File Structure

```
src/
├── pages/
│   ├── Login.js              # Authentication page
│   ├── RepDashboard.js       # Sales rep EOD form
│   └── CSODashboard.js       # Manager performance dashboard
├── styles/
│   ├── Login.css
│   ├── RepDashboard.css
│   └── CSODashboard.css
├── App.js                    # Main routing component
├── App.css                   # Global styles
├── firebase.js              # Firebase configuration
└── index.js                 # React entry point
```

## Firebase Setup

- **Authentication**: Email/Password authentication enabled
- **Database**: Firestore with `eod_reports` collection
- **Environment Variables**: Loaded from `.env.local` (not committed to GitHub)

## Testing Accounts

- **Rep Account**: Any email not containing "israel"
- **CSO Account**: Email containing "israel" (e.g., israel@company.com)

Both can be created on first login via the Sign Up option.

## Made with ❤️ for TRI Sales Excellence
