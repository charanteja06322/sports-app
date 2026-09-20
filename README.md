# EZKORA Sports Platform ⚽🏀🏏

An authentic multi-sport community platform and live scoring console built with **React**, **Vite**, **Electron**, and **Supabase (PostgreSQL)**.

---

## Features

- **⚛️ Native Electron Desktop App**: Run natively on macOS, Windows, and Linux.
- **⚡ Supabase PostgreSQL Database**: Cloud database with tables for users, posts, post likes, comments, and match fixtures.
- **⚽ 7 Authentic Sport Lenses**:
  - Football (Terracotta `#ce7045`)
  - Basketball
  - Tennis
  - Cricket
  - Running
  - Cycling
  - Volleyball
- **📊 Interactive Scoring Console**: Live touchpoint scoring with ball-by-ball and point counter mechanisms.
- **🚫 Zero Mock Data**: Clean slate with real authentication, athlete registration, and photo uploads.
- **🪶 Feather Vector Icons**: Clean UI navigation without emoji clutter.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory (see `.env.example`):
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
PORT=5173
```

### 3. Launch the Application

#### Electron Desktop App:
```bash
npm run dev
# or npm start
```
This automatically boots the local Vite server and launches the native Electron desktop window.

#### Web Browser:
```bash
npm run web
```
Visit `http://localhost:5173/` in your browser.

---

## Project Structure

```
├── electron/
│   ├── main.cjs            # Electron main process (BrowserWindow)
│   └── run-electron.js     # Automatic concurrent runner
├── server/
│   ├── db.js               # Supabase PostgreSQL connection & schema
│   ├── apiHandler.js       # API middleware & endpoints (/api/*)
│   └── server.js           # Standalone HTTP server
├── src/
│   ├── components/ezkora/  # Sport strips, topbar, scoreboard, feed cards
│   ├── pages/              # Home, Players, Games, Scores, Settings
│   ├── store/              # Zustand state management (ezkoraStore)
│   └── App.jsx             # Router & main layout
└── package.json
```
