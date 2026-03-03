import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import "./App.css";
import RootLayout from "./components/layouts/RootLayout";
import ErrorPage from "./components/pages/ErrorPage";
import HomePage from "./components/pages/HomePage";
import MovieDetailPage from "./components/pages/MovieDetailPage";
import VideoPlayer from "./components/organisms/VideoPlayer";
import SearchPage from "./components/pages/SearchPage";
import WatchlistPage from "./components/pages/WatchlistPage";
import AboutPage from "./components/pages/AboutPage";
import SignInPage from "./components/pages/SignInPage";
import SignUpPage from "./components/pages/SignUpPage";
import ProfilePage from "./components/pages/ProfilePage";
import ProtectedRoute from "./components/helpers/ProtectedRoute";

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
    <RouterProvider router={router} />;
    <Analytics />
  </>
  )
}

export default App;
