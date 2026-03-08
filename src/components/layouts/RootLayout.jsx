import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, Suspense } from "react";
import Navbar from "../organisms/navigation/Navbar";
import Footer from "../organisms/Footer";
import ScrollToTop from "../atoms/ScrollToTop";

const PageLoader = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col selection:bg-green-500 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="grow">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default RootLayout;
