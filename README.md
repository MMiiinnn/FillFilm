# 🎬 FillFilm

![React](https://img.shields.io/badge/react_19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss_4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite_7-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black)

**FillFilm** is a premium movie discovery web application powered by the **TMDB API** and enhanced with **Google Gemini AI**. Built with React 19 and modern web technologies, it delivers a Netflix-like streaming experience with AI-powered recommendations, user authentication, and a personalized watchlist.

**Live Demo**: [fillfilm.vercel.app](https://fillfilm.vercel.app)

---

## ✨ Features

### Core
- **Movie & TV Discovery** — Browse trending, popular, top-rated, now playing, upcoming movies, Korean dramas, and more
- **Smart Search** — Real-time multi-search with glassmorphic UI, filters (Movies / TV Shows), and empty states
- **Movie Details** — Full info with cast, trailers, storyline, runtime, and similar recommendations
- **Video Playback** — Watch content via 4 embedded server sources with server-switching UI

### AI-Powered
- **Mood Picker** — Select your mood (Happy, Sad, Excited, etc.) and get 5 AI-curated movie recommendations from Google Gemini
- **"Why Watch This?"** — AI generates a 1-sentence hook for any movie on the detail page

### User Features
- **Firebase Authentication** — Sign up / Sign in with email or Google, forgot password flow
- **Personalized Watchlist** — Add/remove movies, persisted in localStorage, protected by auth
- **User Profile** — Edit display name, view watchlist stats, quick navigation links

### Design & UX
- **Fully Responsive** — Optimized for desktop, tablet, and mobile
- **Dark Mode Aesthetic** — Glassmorphism, smooth animations, gradient effects
- **Skeleton Loaders** — Loading states for all data-fetched content
- **Atomic Design Architecture** — Components organized as Atoms → Molecules → Organisms → Pages

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Styling** | TailwindCSS 4 |
| **Routing** | React Router DOM 7 |
| **State Management** | Zustand 5 (with localStorage persist) |
| **HTTP Client** | Axios (with interceptors) |
| **Authentication** | Firebase Auth (Email + Google) |
| **AI** | Google Gemini 2.5 Flash |
| **Movie Data** | TMDB API |
| **UI Libraries** | Swiper, React Icons, React Hot Toast, React Player |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MMiiinnn/MovieApp.git
   cd MovieApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # TMDB API (Required)
   VITE_API_KEY=your_tmdb_read_access_token

   # Google Gemini AI (Optional — AI features disabled without it)
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Firebase (Required for authentication)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

Based on **Atomic Design** principles:

```
src/
├── components/
│   ├── atoms/          # Badge, Button, Icon, Input, MovieRating, ScrollToTop, UserAvatar, etc.
│   ├── molecules/      # AuthForm, CastCard, MovieCard, Search, UserMenu
│   ├── organisms/      # AwardSection, Footer, HeroSection, MoodPicker, MovieList, VideoPlayer
│   │   └── navigation/ # Navbar, DesktopNav, MobileNav, MobileSideBar
│   ├── layouts/        # RootLayout
│   ├── pages/          # Home, MovieDetail, Search, Watchlist, About, SignIn, SignUp, Profile, ForgotPassword, Error
│   └── helpers/        # ProtectedRoute, formatRuntime
├── services/           # apiConfig, tmdbService, geminiService, authService
├── store/              # useWatchlistStore, useAuthStore (Zustand)
├── config/             # firebase.js
├── App.jsx             # Routing configuration
├── main.jsx            # Entry point with auth initialization
└── index.css           # Global styles & Tailwind theme
```

---

## 🗺️ Routes

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Home | — |
| `/movie/:movieId` | Movie Detail | — |
| `/movie/:movieId/watch` | Video Player | — |
| `/search` | Search Results | — |
| `/watchlist` | My Watchlist | ✅ |
| `/profile` | User Profile | ✅ |
| `/signin` | Sign In | — |
| `/signup` | Sign Up | — |
| `/reset-password` | Forgot Password | — |
| `/about` | About | — |

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

&copy; 2026 FillFilm. All Rights Reserved.