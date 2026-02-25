# 🎬 FillFilm - Project Context Document

## 📋 Project Overview

**FillFilm** is a premium, modern movie discovery web application built with React and powered by The Movie Database (TMDB) API. The application provides a Netflix-like streaming experience with advanced features including AI-powered movie recommendations using Google Gemini AI.

### Key Information
- **Project Name**: FillFilm (package name: netflix-clone)
- **Repository**: https://github.com/MMiiinnn/MovieApp
- **Tech Stack**: React 19, Vite, TailwindCSS 4, Zustand, Axios
- **Current Status**: Production-ready with AI integration completed
- **Last Updated**: February 2026

---

## 🛠️ Technology Stack

### Core Technologies
- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 4.1.18 (with custom theme)
- **Routing**: React Router DOM 7.13.0
- **State Management**: Zustand 5.0.11 (with persist middleware)
- **HTTP Client**: Axios 1.13.4

### Additional Libraries
- **UI Components**: 
  - Swiper 12.0.3 (for carousels)
  - React Icons 5.5.0 (Material Icons)
  - React Hot Toast 2.6.0 (notifications)
- **Media**: React Player 3.4.0 (video playback)
- **AI Integration**: @google/generative-ai 0.24.1 (Gemini API)

### Development Tools
- ESLint 9.39.1
- PostCSS 8.5.6
- Autoprefixer 10.4.23

---

## 📂 Project Structure

The project follows **Atomic Design** principles for maximum reusability and maintainability:

```
MovieApp/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── atoms/             # Basic UI building blocks
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Genres.jsx
│   │   │   ├── Icon.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── MovieCardSkeleton.jsx
│   │   │   ├── MovieRating.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── molecules/         # Simple component groups
│   │   │   ├── CastCard.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   └── Search.jsx
│   │   ├── organisms/         # Complex sections
│   │   │   ├── AwardSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MoodPicker.jsx      # AI-powered feature
│   │   │   ├── MovieList.jsx
│   │   │   ├── SideMovieList.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   └── navigation/         # Navigation components
│   │   ├── layouts/           # Page wrappers
│   │   │   └── RootLayout.jsx
│   │   ├── pages/             # Route destinations
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ErrorPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── MovieDetailPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   └── WatchlistPage.jsx
│   │   └── helpers/           # Utility functions
│   ├── services/              # API integration layer
│   │   ├── apiConfig.js       # Axios instance & config
│   │   ├── tmdbService.js     # TMDB API methods
│   │   └── geminiService.js   # Google Gemini AI integration
│   ├── store/                 # State management
│   │   └── useWatchlistStore.js
│   ├── App.jsx                # Routing configuration
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles & Tailwind config
├── .env                       # Environment variables (API keys)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md
└── ROADMAP.md
```

---

## 🎯 Core Features

### 1. **Movie Discovery & Browsing**
- **Hero Section**: Full-screen carousel showcasing trending movies
- **Multiple Categories**:
  - Trending (Movies & TV Shows)
  - Popular Movies
  - Top Rated
  - Now Playing (in theaters)
  - Upcoming Movies
  - Korean TV Series (K-Drama)
  - Popular TV Shows
  - Top 10 Today

### 2. **Search Functionality**
- Real-time multi-search (movies & TV shows)
- Glassmorphic search UI with click-outside and scroll-to-close logic
- Dedicated search results page (`/search`)
- Shows trending movies when no query is present
- Filter options (Movies vs TV Shows)

### 3. **Movie Details**
- Comprehensive movie/TV show information
- Cast & crew display (top 8 actors)
- Video player integration for trailers
- Similar movie recommendations
- Runtime, genres, ratings, and descriptions

### 4. **Watchlist Feature** (Zustand + localStorage)
- Add/remove movies to personal watchlist
- Persistent storage across sessions
- Toast notifications for user feedback
- Dedicated watchlist page (`/watchlist`)
- Integration in HeroSection, MovieDetailPage, and Navbar

### 5. **AI-Powered Mood Picker** 🤖
- **Technology**: Google Gemini 2.5 Flash model
- **Functionality**: 
  - User selects mood (Happy, Sad, Excited, Relaxed, Thoughtful, Scared)
  - AI generates 5 movie recommendations with reasons
  - Automatically searches TMDB for recommended movies
  - Displays results with posters, ratings, and AI-generated reasons
- **Location**: HomePage (`MoodPicker.jsx` component)

### 6. **Responsive Design**
- Fully responsive across all devices
- Mobile-optimized navigation
- Adaptive layouts for different screen sizes

### 7. **Premium UI/UX**
- Dark mode aesthetic
- Glassmorphism effects
- Smooth animations and transitions
- Skeleton loaders for loading states
- Custom fonts: Montserrat (body), Bebas Neue (headings)
- Custom color palette with brand green (#16a34a)

---

## 🔌 API Integration

### TMDB API Service (`tmdbService.js`)

**Key Methods** (all with JSDoc documentation):
- `transformMovie(movie)` - Transforms raw TMDB data to app format
- `getTrending()` - Trending movies/TV for the day
- `getPopular()` - Popular movies
- `getTopRated()` - Top-rated movies
- `getNowPlaying()` - Movies in theaters
- `getUpComing()` - Upcoming movies
- `getTrendingMovies()` - Trending movies for the week
- `getPopularTV()` - Popular TV shows
- `getTopToday()` - Top 10 trending items
- `getKoreanTVSeries()` - Korean dramas (filtered by language)
- `getMovieDetails(movieId, options)` - Detailed movie info with optional extended data (cast, videos, similar)
- `search(query)` - Multi-search for movies and TV shows

**API Configuration** (`apiConfig.js`):
- Axios instance with base URL and interceptors
- Global error handling (auto-redirect on 401)
- Image URL helper function with size options
- Bearer token authentication

### Gemini AI Service (`geminiService.js`)

**Methods**:
- `generateText(prompt)` - Generates AI text responses
- `isConfigured()` - Checks if API key is available

**Model**: gemini-2.5-flash

---

## 🗺️ Routing Structure

```javascript
/ (RootLayout)
├── / (HomePage)
├── /movie/:movieId (MovieDetailPage)
│   └── /movie/:movieId/watch (VideoPlayer)
├── /search (SearchPage)
├── /watchlist (WatchlistPage)
├── /about (AboutPage)
└── /* (ErrorPage - 404)
```

---

## 🎨 Design System

### Typography
- **Body Font**: Montserrat (sans-serif)
- **Heading Font**: Bebas Neue (sans-serif)

### Color Palette
- **Brand Green**: #16a34a
- **Background**: Zinc-950 (dark)
- **Text**: White/Zinc-400
- **Accents**: Purple-400 to Pink-600 gradients

### Component Patterns
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Cards**: Hover effects with scale transforms
- **Skeletons**: Animated loading states
- **Icons**: Material Icons via react-icons
- **Badges**: Genre and rating badges

### Swiper Customization
- Custom pagination bullets (brand green active state)
- Fade transitions for hero section
- No-scrollbar utility classes

---

## 📦 State Management

### Watchlist Store (`useWatchlistStore.js`)

**State**:
- `watchlist: []` - Array of saved movies

**Actions**:
- `addToWatchlist(movie)` - Adds movie with duplicate check
- `removeFromWatchlist(movieId)` - Removes movie by ID
- `isInWatchlist(movieId)` - Checks if movie exists
- `clearWatchlist()` - Clears all items

**Persistence**: 
- Stored in localStorage as "movie-watchlist"
- Automatically syncs on changes

---

## 🔐 Environment Variables

Required in `.env` file:

```env
VITE_API_KEY=<TMDB_API_READ_ACCESS_TOKEN>
VITE_GEMINI_API_KEY=<GOOGLE_GEMINI_API_KEY>
```

**Note**: Current keys are already configured in the project.

---

## 🚀 Development Workflow

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

---

## 📈 Development Roadmap Status

### ✅ Completed Phases

**Phase 1: Foundation & Core UI**
- Project setup with Vite + React + TailwindCSS
- Atomic architecture implementation
- Responsive navigation system
- Search system with glassmorphic UI
- Skeleton loaders and reusable components

**Phase 2: Refactoring & Infrastructure**
- Axios integration with interceptors
- JSDoc documentation for all services
- Search page enhancements (empty states, filters)

**Phase 3: Global State & User Personalization**
- Zustand store for watchlist
- localStorage persistence
- React Hot Toast integration
- Dynamic watchlist buttons

**Phase 4: AI Integration** 🆕
- Google Gemini API connection
- Mood-based movie recommendations
- AI-generated movie descriptions

### 🔄 Pending (Phase 5: Security & Optimization)
- [ ] Sanitize AI outputs (DOMPurify)
- [ ] Lighthouse audit (target: 90+ score)
- [ ] Lazy loading for images and components
- [ ] Optional TypeScript migration for complex components

---

## 🎭 Recent Refactoring (Last Conversations)

### Conversation: Refactoring Icons and Services (Feb 10, 2026)
- Moved `tmdbService.js` and `apiConfig.js` to `src/services/`
- Updated all import paths across the project
- Replaced hardcoded icons (including emojis) with `<Icon />` component
- Updated `AboutPage.jsx` to reflect current project state

### Conversation: Refactor Award Section (Feb 9, 2026)
- Refactored `AwardSection.jsx` for application suitability

### Conversation: Navigation & Page Refactoring (Feb 8, 2026)
- Consolidated "Discover" into search page
- Pointed "Movie Release" to upcoming section on homepage
- Removed "Forum" link
- Created simple "About" page
- Enhanced search page with trending movies default view

### Conversation: Implementing Watchlist Feature (Feb 5, 2026)
- Created Zustand store with localStorage persistence
- Integrated watchlist into UI components

---

## 🎯 Key Design Principles

1. **Atomic Design**: Components organized from atoms → molecules → organisms → pages
2. **Separation of Concerns**: Services layer separate from UI components
3. **Reusability**: All UI elements built as reusable components
4. **Performance**: Skeleton loaders, lazy loading considerations
5. **User Experience**: Toast notifications, smooth animations, responsive design
6. **Modern Aesthetics**: Dark mode, glassmorphism, gradients, micro-animations

---

## 🔍 Important Implementation Details

### Image Handling
- Uses TMDB's image CDN with configurable sizes
- Default: w500 for posters, original for backdrops
- Helper function: `getImageUrl(path, size)` in `apiConfig.js`

### Video Player
- Integrated with React Player
- Supports multiple video sources
- Embedded in MovieDetailPage with nested routing

### Search Behavior
- Filters out non-movie/TV results (excludes people)
- Real-time search with debouncing (handled in component)
- Shows trending content when query is empty

### Mood Picker AI Flow
1. User selects mood
2. Gemini generates JSON array of movie titles + reasons
3. App searches TMDB for each title
4. Displays matched movies with AI-generated descriptions
5. Error handling for API failures and missing movies

---

## 🐛 Known Considerations

1. **Genre Mapping**: Currently uses placeholder genres in `transformMovie()` - real genre mapping can be added
2. **AI Response Parsing**: Cleans markdown code blocks from Gemini responses
3. **Error Handling**: Global error interceptor in Axios, component-level try-catch blocks
4. **Accessibility**: Basic implementation, can be enhanced with ARIA labels
5. **SEO**: Basic meta tags present, can be enhanced with React Helmet

---

## 📝 Code Style & Conventions

- **File Naming**: PascalCase for components (e.g., `MovieCard.jsx`)
- **Service Files**: camelCase (e.g., `tmdbService.js`)
- **CSS**: TailwindCSS utility classes, custom components in `@layer components`
- **State**: Functional components with hooks
- **Async/Await**: Preferred over promises for API calls
- **Comments**: JSDoc for service methods, inline comments for complex logic

---

## 🎬 Deployment

- **Platform**: Vercel (configured with `vercel.json`)
- **Build Command**: `vite build`
- **Output Directory**: `dist`

---

## 📚 Additional Resources

- **TMDB API Docs**: https://developer.themoviedb.org/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **React Router**: https://reactrouter.com/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **TailwindCSS**: https://tailwindcss.com/

---

## 💡 Tips for Working with This Project

1. **Adding New TMDB Endpoints**: Add methods to `tmdbService.js` with JSDoc
2. **Creating New Components**: Follow atomic design - determine if it's an atom, molecule, or organism
3. **State Management**: Use Zustand for global state, useState for local component state
4. **Styling**: Use TailwindCSS utilities first, create custom classes in `index.css` only when necessary
5. **Icons**: Use `<Icon name="material_icon_name" />` component instead of hardcoding
6. **Toast Notifications**: Import `toast` from 'react-hot-toast' for user feedback
7. **AI Features**: Check `geminiService.isConfigured()` before using AI features

---

## 🎉 Project Highlights

- **Modern Stack**: Latest versions of React, Vite, and TailwindCSS
- **AI Integration**: Cutting-edge Gemini AI for personalized recommendations
- **Production Ready**: Complete error handling, loading states, and user feedback
- **Scalable Architecture**: Atomic design allows easy expansion
- **Premium UX**: Smooth animations, glassmorphism, and thoughtful interactions

---

**Last Updated**: February 11, 2026  
**Version**: 0.0.0 (Development)  
**Maintained by**: MMiiinnn

---

## 🤝 For Other Chatbots

When working with this project:
- Always check `tmdbService.js` for available API methods before creating new ones
- Use the existing component library (atoms/molecules/organisms) before creating new components
- Follow the established routing structure in `App.jsx`
- Maintain the atomic design pattern
- Test AI features with the configured Gemini API key
- Use Zustand store for any new global state needs
- Keep the premium aesthetic consistent with existing design patterns
