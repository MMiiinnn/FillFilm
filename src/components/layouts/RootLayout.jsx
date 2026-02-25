import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Navbar from "../organisms/navigation/Navbar";
import Footer from "../organisms/Footer";
import ScrollToTop from "../atoms/ScrollToTop";

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col selection:bg-green-500 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="grow">
        <Outlet />
      </main>

      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default RootLayout;
