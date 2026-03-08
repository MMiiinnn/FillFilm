# FillFilm — Project Context

## Overview

FillFilm is a full-stack movie discovery web application that replicates a Netflix-like streaming experience. It integrates three external services — TMDB for movie data, Firebase for authentication, and Google Gemini for AI-powered recommendations — into a cohesive, responsive, and visually polished single-page application.

This document explains every technical decision, architecture pattern, and implementation detail in the project.

---

## Tech Stack & Justification

| Technology | Version | Why It Was Chosen |
|------------|---------|-------------------|
| **React** | 19 | Component-based UI library. Hooks (`useState`, `useEffect`, `useRef`, `useParams`, `useNavigate`) handle all component logic without class components. |
| **Vite** | 7 | Near-instant HMR and fast production builds via ESBuild. Chosen over CRA/Webpack for developer experience and build speed. |
| **TailwindCSS** | 4 | Utility-first CSS — all styling is done inline via class names with no separate CSS files per component. Enables rapid prototyping and consistent design tokens. |
| **React Router DOM** | 7 | Client-side routing with `createBrowserRouter`. Supports nested routes (movie detail → video player), route protection, and error boundaries. |
| **Zustand** | 5 | Lightweight state management (2 stores, ~80 lines total). Chosen over Redux for simplicity. Supports middleware (`persist` for localStorage). |
| **Axios** | Latest | HTTP client with interceptor support. Centralizes API configuration, auth headers, response unwrapping, and error handling. |
| **Firebase Auth** | Latest | Managed authentication service. Handles email/password sign-up, Google OAuth, password reset emails, and profile updates without building a backend. |
| **Google Gemini** | 2.5 Flash | Generative AI for natural language movie recommendations. Used for mood-based suggestions and per-movie "Why Watch This?" hooks. |
| **Swiper** | Latest | Touch-friendly carousel/slider library. Used for the hero section (fade effect) and horizontal movie lists (free-mode scrolling). |
| **React Hot Toast** | Latest | Lightweight toast notification system for success/error/loading feedback across auth flows and AI interactions. |
| **Vercel Analytics** | Latest | Production analytics integration, injected at the app root level. |

---

## Architecture

### Atomic Design Pattern

The component hierarchy follows Atomic Design, which organizes UI elements by complexity:

```
Atoms → Molecules → Organisms → Pages
```

**Atoms** are the smallest, reusable UI primitives:

| Component | Purpose | Key Technique |
|-----------|---------|---------------|
| `Button` | Universal button with 7 variants (primary, secondary, outline, ghost, icon, link, google) | Variant pattern via object lookup, spread props, loading spinner state |
| `Input` | Form input with password toggle, email validation indicator, error states | `forwardRef` for parent ref access, conditional `type` switching |
| `Icon` | Material Symbols + FontAwesome icons in one component | Conditional rendering based on `type` prop |
| `Badge` | Small label/tag | Minimal composition component |
| `MovieRating` | Star + score display | — |
| `MovieCardSkeleton` | Loading placeholder with 2 variants (vertical/horizontal) | CSS `animate-pulse` for shimmer effect |
| `ScrollToTop` | Floating button that appears on scroll | `window.scrollY` threshold with event listener cleanup |
| `UserAvatar` | User photo or name-initial fallback | String parsing for initials (handles multi-word names) |
| `Genres` | Genre list display, handles both object and string formats | Dynamic type coercion (`typeof g === "object" ? g.name : g`) |

**Molecules** combine atoms into functional groups:

| Component | Purpose | Key Technique |
|-----------|---------|---------------|
| `MovieCard` | Clickable card with 2 layouts (vertical poster / horizontal ranked) | Conditional variant rendering, `useNavigate` for programmatic routing |
| `AuthForm` | Reusable sign-in / sign-up form | Mode-based rendering (`isSignUp` prop), per-field validation, Google OAuth button |
| `Search` | Animated expandable search bar | `useRef` for focus management, click-outside detection via `mousedown` event, `Escape` key handler |
| `CastCard` | Actor photo + name + character | Placeholder image fallback |
| `UserMenu` | Avatar dropdown with profile/watchlist/sign-out links | Click-outside to close, auth state from Zustand |

**Organisms** are complex, self-contained sections:

| Component | Purpose | Key Technique |
|-----------|---------|---------------|
| `HeroSection` | Full-screen carousel of featured movies | Swiper with fade effect, auto-play, pagination, watchlist toggle with `stopPropagation` |
| `MovieList` | Horizontal scrollable movie row with skeleton loading | Swiper free-mode, responsive breakpoints, variant-based card sizing |
| `AwardSection` | Featured movie spotlight + 2 side lists | 12-column CSS grid layout |
| `SideMovieList` | Vertically scrollable movie list with manual scroll buttons | `useRef` for scroll control (`scrollBy`), color theming via `isLive` prop |
| `MoodPicker` | AI mood-based recommendation engine | 6 mood buttons → Gemini prompt → parse 5 titles → TMDB search → display results |
| `VideoPlayer` | Embedded video player with 4 server sources | Server switching via state, `key` prop to force iframe re-render on source change |
| `Footer` | Site footer with social links and nav | FontAwesome icons via dynamic class names |
| `Navbar` | Responsive nav container | Scroll-aware background blur (`scrollY > 50`), conditional desktop/mobile rendering |
| `DesktopNav` | Desktop navigation with auth-aware UI | Renders `UserMenu` when authenticated, Sign Up/Login buttons when not |
| `MobileNav` | Mobile top bar with hamburger + search | Search animation toggle |
| `MobileSideBar` | Full-screen slide-out menu | Transform-based animation, body scroll lock concept, user profile section |

**Pages** are full route destinations:

| Page | Route | Data Fetching | Key Features |
|------|-------|---------------|--------------|
| `HomePage` | `/` | 9 parallel API calls via `Promise.all` | HeroSection, MoodPicker, AwardSection, 6 MovieLists, skeleton loading states |
| `MovieDetailPage` | `/movie/:id` | `getMovieDetails` with extended option | Backdrop hero, genre badges, cast grid, trailer iframe, AI "Why Watch This?", similar movies, nested `<Outlet>` for video player |
| `SearchPage` | `/search?q=` | `search()` or `getTrending()` fallback | Filter tabs (All/Movies/TV), count per filter, empty state with clear-filter button |
| `WatchlistPage` | `/watchlist` | From Zustand store (no API call) | Protected route, clear-all with confirmation dialog, empty state CTA |
| `ProfilePage` | `/profile` | From auth store + watchlist store | Protected route, editable display name (`updateProfile`), watchlist stats |
| `AboutPage` | `/about` | None (static) + AI connection test | Feature cards, tech stack badges, live Gemini connection test button |
| `SignInPage` | `/signin` | None | Email + Google auth, forgot password link, redirect after successful login |
| `SignUpPage` | `/signup` | None | Email + Google auth, redirect after successful signup |
| `ForgotPasswordPage` | `/reset-password` | None | Email input → `resetPassword()`, success state with email-sent confirmation |
| `ErrorPage` | Catch-all | None | Dynamic error code display, retry button, "Back to Home" link |

---

## Data Flow

### API Layer Architecture

```
Component → tmdbService → apiConfig (Axios) → TMDB API
                ↓
         transformMovie() ← genreMap (cached)
```

**`apiConfig.js`** — Centralized Axios instance:
- **Base URL**: `https://api.themoviedb.org/3`
- **Auth**: Bearer token via `Authorization` header (TMDB v4 read access token)
- **Request Interceptor**: Passthrough (extensible for logging/caching)
- **Response Interceptor**: Unwraps `response.data` automatically, handles 401/404/429/5xx errors with specific messages, catches network errors
- **`getImageUrl()`**: Helper that constructs TMDB image URLs with size parameter, returns a branded placeholder if path is null

**`tmdbService.js`** — Business logic layer:
- **`transformMovie()`**: Normalizes raw TMDB data into a unified app format (`id`, `title`, `desc`, `poster`, `backdrop`, `rating`, `genres`, `type`, `ageRating`)
- **Genre Caching**: Fetches `/genre/movie/list` + `/genre/tv/list` once, stores in a `Map<id, name>`. Uses a promise-deduplication pattern to prevent concurrent duplicate fetches. Every API method calls `await getGenreMap()` before transforming data.
- **11 API methods**: `getTrending`, `getPopular`, `getTopRated`, `getNowPlaying`, `getUpComing`, `getTrendingMovies`, `getPopularTV`, `getTopToday`, `getKoreanTVSeries`, `getMovieDetails`, `search`
- **`getMovieDetails()`**: Supports an `extended` option that fetches cast, videos, and similar movies in a single request via TMDB's `append_to_response` parameter

**`geminiService.js`** — AI service:
- Uses `@google/generative-ai` SDK with Gemini 2.5 Flash model
- Single method `generateText(prompt)` that returns raw text
- Gracefully returns `null` if API key is missing (AI features silently disabled)

**`authService.js`** — Firebase wrapper:
- Methods: `signUp`, `signIn`, `signInWithGoogle`, `signOut`, `resetPassword`, `updateUserProfile`, `getCurrentUser`, `onAuthStateChange`
- Each method handles its own error mapping (Firebase error codes → user-friendly messages) and toast notifications
- Google sign-in uses `GoogleAuthProvider` + `signInWithPopup`
- `onAuthStateChange` wraps Firebase's `onAuthStateChanged` listener for reactive auth state

---

## State Management

### Zustand Stores

**`useAuthStore`** (39 lines):
```
State: { user, loading, initialized }
Actions: { setUser, setLoading, initAuth, signOut }
```
- `initAuth()` subscribes to Firebase's `onAuthStateChanged` — called once in `main.jsx` before React renders
- No persistence (auth state comes from Firebase on each page load)

**`useWatchlistStore`** (44 lines):
```
State: { watchlist: [] }
Actions: { addToWatchlist, removeFromWatchlist, clearWatchlist, isInWatchlist }
```
- Uses Zustand's `persist` middleware with `localStorage` as storage engine
- `addToWatchlist` checks for duplicates before adding
- `isInWatchlist` uses `.some()` for O(n) lookup

### Why Zustand Over Redux/Context

- **2 stores, ~80 lines total** — Redux would require 3-4x more boilerplate (slices, actions, reducers, provider)
- **No Context re-render issues** — Zustand subscriptions are granular; components only re-render when their selected state changes
- **Built-in persistence** — Zustand's `persist` middleware handles localStorage serialization automatically

---

## Authentication Flow

```
main.jsx
  └── useAuthStore.initAuth()
        └── authService.onAuthStateChange(callback)
              └── Firebase onAuthStateChanged listener
                    ├── User exists → setUser(user), setLoading(false)
                    └── No user → setUser(null), setLoading(false)
```

**Protected Routes**: `ProtectedRoute` component checks `user` and `loading` from auth store:
- If `loading` → shows spinner
- If no `user` → redirects to `/signin` with `state.from` for post-login redirect
- If `user` → renders children

**Sign-In Flow**: Email → `authService.signIn()` → Firebase validates → `onAuthStateChanged` fires → Zustand updates → UI reacts → redirect to previous page or home

**Google Sign-In**: `authService.signInWithGoogle()` → `signInWithPopup(auth, googleProvider)` → same auth state flow

**Password Reset**: Email → `authService.resetPassword()` → Firebase sends email → success toast → UI shows confirmation state

---

## AI Integration

### MoodPicker Flow

```
User selects mood → Build Gemini prompt →
"Suggest 5 [mood] movies. Return ONLY titles, one per line." →
Parse response (split by newline, clean numbering) →
For each title: tmdbService.search(title) →
Display first result of each search as MovieCard
```

- **Prompt Engineering**: The prompt explicitly instructs "Return ONLY movie titles, one per line, no numbering or extra text" to ensure parseable output
- **Error Handling**: If Gemini fails, a toast error is shown. If a title search returns no results, it's silently skipped.

### "Why Watch This?" (MovieDetailPage)

- Button triggers `fetchAiReason()` which sends: `Give me a short, intriguing, 1-sentence reason why someone should watch the movie "${movie.title}"`
- Response is displayed in a styled purple card with animation
- Button is disabled after first use (prevents spam)

---

## Routing Architecture

```jsx
createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,      // Navbar + Footer + Outlet + Toaster
    errorElement: <ErrorPage />,   // Catch-all error boundary
    children: [
      { index: true, element: <HomePage /> },
      { path: "movie/:movieId", element: <MovieDetailPage />,
        children: [
          { path: "watch", element: <VideoPlayer /> }  // Nested route
        ]
      },
      { path: "search", element: <SearchPage /> },
      { path: "watchlist", element: <ProtectedRoute><WatchlistPage /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "reset-password", element: <ForgotPasswordPage /> },
      { path: "about", element: <AboutPage /> },
    ]
  }
])
```

**Key patterns**:
- **Nested routing**: `/movie/:id/watch` renders `VideoPlayer` inside `MovieDetailPage`'s `<Outlet>` — keeps the movie info visible while watching
- **`useOutletContext`**: Parent passes `{ movie, isWatching }` to child via outlet context (no prop drilling)
- **Error boundary**: `ErrorPage` uses `useRouteError()` to display the actual HTTP status code and message
- **Scroll restoration**: `RootLayout` uses `useEffect` with `pathname` dependency to `scrollTo(0, 0)` on every route change

---

## Responsive Design Strategy

The app targets 3 breakpoints using Tailwind's responsive prefixes:

| Breakpoint | Target | Strategy |
|------------|--------|----------|
| Default (< 768px) | Mobile | Single column, compact cards, hamburger menu, MobileSideBar |
| `md:` (768px+) | Tablet | 2-3 column grids, expanded cards |
| `lg:` (1024px+) | Desktop | Full layout, DesktopNav, poster images shown, larger typography |

**Key responsive decisions**:
- **Navigation**: `DesktopNav` is `hidden lg:flex`, `MobileNav` is `flex lg:hidden`
- **Hero section**: `h-[75vh]` on mobile, `h-screen` on desktop
- **Movie grids**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- **Movie poster in detail page**: `hidden md:block` (hidden on mobile to save space)
- **`overflow-x-hidden`** on root layout to prevent horizontal scroll issues

---

## UI/UX Patterns

### Visual Design
- **Color palette**: `zinc-950` background, `green-500/600` as brand accent, `purple-500` for AI features, `red-500` for live/destructive actions
- **Glassmorphism**: Auth forms use `bg-zinc-900/50 backdrop-blur-xl border border-zinc-800` for frosted glass effect
- **Gradients**: Hero overlays use `bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent` for cinematic fade
- **Glow effects**: Video player has `shadow-[0_0_60px_rgba(22,163,74,0.4)]` for ambient glow
- **Typography**: Montserrat (headings), Bebas Neue (logo/hero), system fonts (body) via Google Fonts

### Animations
- **CSS animations**: `animate-in fade-in slide-in-from-bottom-6 duration-700` for page entrance
- **Hover effects**: Cards scale (`hover:scale-105`), images zoom (`group-hover:scale-110`), borders glow
- **Loading states**: Spinner (border animation), skeleton loaders (pulse), inline loading text
- **Transitions**: All interactive elements use `transition-all duration-300` for smooth state changes

### User Feedback
- **Toast notifications**: Success (green), error (red), loading (spinner) for every async operation
- **Confirmation dialogs**: `window.confirm()` before destructive actions (clear watchlist)
- **Empty states**: Custom illustrations with Icon + message + CTA button (watchlist, search)
- **Active indicators**: Green dot with glow (`shadow-[0_0_10px]`) for active navigation, filter counts in search

---

## Security Considerations

- **Environment variables**: All API keys stored in `.env` with `VITE_` prefix, excluded from git via `.gitignore`
- **Firebase security**: Auth handled entirely by Firebase SDK (no custom token storage)
- **CORS**: TMDB API handles CORS headers; no proxy needed
- **Input validation**: Auth forms validate email format and password length before submission
- **XSS surface**: AI-generated text is rendered as text content (not `dangerouslySetInnerHTML`), reducing injection risk

---

## Performance Patterns

- **Parallel data fetching**: HomePage fires 9 API calls simultaneously via `Promise.all`, with independent loading states per section
- **Genre caching**: TMDB genre lists fetched once and cached in memory (module-level variable). Promise deduplication prevents concurrent duplicate requests.
- **Image optimization**: TMDB images requested at appropriate sizes (`w500` for cards, `original` for backdrops)
- **Conditional data loading**: `getMovieDetails({ extended: true })` uses TMDB's `append_to_response` to fetch cast + videos + similar in a single HTTP request instead of 4 separate calls
- **Skeleton loading**: Every data-fetched section shows skeleton placeholders during loading, preventing layout shift

---

## Skills & Knowledge Demonstrated

| Category | Specific Skills |
|----------|----------------|
| **React** | Functional components, hooks (useState, useEffect, useRef, useParams, useNavigate, useLocation, useSearchParams, useOutletContext), forwardRef, conditional rendering, event handling, key-based re-rendering |
| **State Management** | Zustand stores, persist middleware, localStorage integration, global vs local state decisions |
| **Routing** | createBrowserRouter, nested routes, route protection, error boundaries, programmatic navigation, URL search params |
| **API Integration** | REST API consumption, Axios interceptors, Bearer token auth, response normalization, error handling by status code, data transformation layer |
| **Authentication** | Firebase Auth, email/password auth, Google OAuth (popup), password reset, auth state listeners, protected routes |
| **AI/ML Integration** | Google Gemini API, prompt engineering, response parsing, graceful degradation when API unavailable |
| **CSS/Design** | TailwindCSS utility classes, responsive design (mobile-first), glassmorphism, gradients, animations, dark mode, custom font integration |
| **Architecture** | Atomic Design pattern, service layer abstraction, separation of concerns, DRY principles, component composition |
| **Performance** | Parallel async operations, data caching with deduplication, conditional fetching, skeleton loaders |
| **Dev Tools** | Vite, ESLint, Git version control, environment variables, Vercel deployment |

---

## File Count Summary

| Category | Count | Total Lines |
|----------|-------|------------|
| Atoms | 9 | ~350 |
| Molecules | 5 | ~440 |
| Organisms | 11 | ~1,250 |
| Pages | 10 | ~1,260 |
| Services | 4 | ~530 |
| Stores | 2 | ~80 |
| Config/Helpers | 4 | ~130 |
| Root files | 3 | ~110 |
| **Total** | **48** | **~4,150** |
