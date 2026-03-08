import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import "./App.css";
import RootLayout from "./components/layouts/RootLayout";
import ErrorPage from "./components/pages/ErrorPage";
import ProtectedRoute from "./components/helpers/ProtectedRoute";

const HomePage = lazy(() => import("./components/pages/HomePage"));
const MovieDetailPage = lazy(() => import("./components/pages/MovieDetailPage"));
const VideoPlayer = lazy(() => import("./components/organisms/VideoPlayer"));
const SearchPage = lazy(() => import("./components/pages/SearchPage"));
const WatchlistPage = lazy(() => import("./components/pages/WatchlistPage"));
const AboutPage = lazy(() => import("./components/pages/AboutPage"));
const SignInPage = lazy(() => import("./components/pages/SignInPage"));
const SignUpPage = lazy(() => import("./components/pages/SignUpPage"));
const ProfilePage = lazy(() => import("./components/pages/ProfilePage"));
const ForgotPasswordPage = lazy(() => import("./components/pages/ForgotPasswordPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movie/:movieId",
        element: <MovieDetailPage />,
        children: [{ path: "watch", element: <VideoPlayer /> }],
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "watchlist",
        element: (
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "reset-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

function App() {
  return (
  <>
    <RouterProvider router={router} />
    <Analytics />
  </>
  )
}

export default App;
