# 🏏 PLAYFIELD - Cricket Sports Platform

A professional cricket social platform built with React Native (Expo), FastAPI, and Supabase.

## 🎨 Features

- **PLAYFIELD Design** - Dark theme with bright green (#00FF00) accents
- **5 Main Screens** - Home, Matches, Create, Discover, Profile
- **Live Matches** - Real-time cricket match tracking
- **Social Feed** - Share posts, performance stats, match results
- **Team Management** - Create and manage cricket teams
- **Tournament System** - Organize and participate in tournaments
- **Player Profiles** - Cricket identity with stats and achievements

## 🚀 Quick Start

### Mobile App
```bash
cd mobile
npx expo start
```

Then:
- Press `a` for Android emulator
- Or scan QR code with Expo Go app

### Backend (Optional)
```bash
cd backend
uvicorn main:app --reload --port 8000
```

## 📱 Test Login

- **Email**: test@example.com
- **Password**: test123
- Or create new account with "Sign Up"

## 🗂️ Project Structure

```
cricket-platform/
├── mobile/              # React Native (Expo) app
│   ├── src/
│   │   ├── screens/    # All app screens
│   │   ├── components/ # Reusable components
│   │   ├── navigation/ # Bottom tabs navigation
│   │   ├── context/    # Auth context
│   │   └── theme/      # Colors and styling
│   └── package.json
│
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── api/       # API routes
│   │   ├── models/    # Database models
│   │   ├── schemas/   # Pydantic schemas
│   │   └── services/  # Business logic
│   └── requirements.txt
│
└── database/          # SQL scripts
    └── SUPABASE_UPDATE.sql
```

## 🎯 Tech Stack

### Mobile
- React Native (Expo)
- TypeScript
- React Navigation
- Supabase Auth

### Backend
- FastAPI (Python)
- SQLAlchemy
- Supabase PostgreSQL
- Pydantic

## 📚 Documentation

- **PLAYFIELD_UI_COMPLETE.md** - Complete UI/UX documentation
- **START_APP_NOW.md** - Quick start guide with testing instructions

## 🔧 Environment Setup

### Mobile (.env)
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
SECRET_KEY=your-secret-key
```

## ✅ Current Status

- ✅ UI/UX matching design images exactly
- ✅ Authentication (Email/Password via Supabase)
- ✅ 5 main screens with proper styling
- ✅ Bottom navigation with raised Create button
- ✅ Dark theme with green accents
- ✅ Empty states (ready for data)
- ✅ Backend API with 32 endpoints
- ⏳ Google Sign In (needs OAuth setup)
- ⏳ Database seeding (optional)

## 📱 Screens

1. **Login** - Welcome screen with email/password and Google button
2. **Home** - PLAYFIELD header, Live matches, Feed with posts
3. **Matches** - 5 tabs (Live/Upcoming/Following/Completed/My)
4. **Create** - 6 creation options (Match/Team/Tournament/Event/Post/Play Now)
5. **Discover** - Categories, Trending, Rankings
6. **Profile** - Large photo, stats, cricket identity, tabs

## 🎨 Design System

### Colors
- Primary: #00FF00 (Bright green)
- Background: #0A0E13 (Dark)
- Cards: #141B23
- Text: #FFFFFF / #8B92A0 / #5A6270
- Live: #FF0000 (Red)

### Typography
- Headers: 20-32px, bold
- Body: 14-16px, regular
- Captions: 11-13px, muted

## 🏃 Development

### Start Development Servers
```bash
# Terminal 1: Mobile
cd mobile && npx expo start

# Terminal 2: Backend (optional)
cd backend && uvicorn main:app --reload --port 8000
```

### Build APK (Android)
```bash
cd mobile
eas build --profile preview --platform android
```

## 📄 License

MIT

## 🤝 Support

For issues or questions, refer to:
- PLAYFIELD_UI_COMPLETE.md (complete feature list)
- START_APP_NOW.md (troubleshooting guide)
