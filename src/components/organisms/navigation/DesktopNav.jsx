import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";
import Search from "../../molecules/Search";
import useWatchlistStore from "../../../store/useWatchlistStore";
import useAuthStore from "../../../store/useAuthStore";
import UserMenu from "../../molecules/UserMenu";

function DesktopNav({links}) {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const { watchlist } = useWatchlistStore();
  const { user } = useAuthStore();

  const urlList = {
    "Home": "/",
    "Discover": "/search",
    "Movie Release": "/#upcoming",
    "About": "/about",
    "Watchlist": "/watchlist",
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isSearch) {
        setIsSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearch]);
  

  return (
    <nav className="hidden lg:flex justify-between items-center h-20 px-10 bg-transparent text-white w-full relative">
      <h1 
        className="text-4xl px-4 cursor-pointer hover:text-green-500 transition-colors" 
        onClick={() => navigate("/")}
      >
        FillFilm
      </h1>

      <ul
        className={`flex gap-1 h-full transition-opacity duration-300 ${isSearch ? "opacity-20 pointer-events-none" : "opacity-100"}`}
      >
        {links.map((link) => (
          <li key={link} className="h-full">
            {urlList[link]?.startsWith("/#") ? (
              <a
                href={urlList[link]}
                className="flex items-center h-full px-5 hover:bg-white hover:text-black transition-all"
              >
                {link}
              </a>
            ) : (
              <Link
                to={urlList[link]}
                className="flex items-center gap-2 h-full px-5 hover:bg-white hover:text-black transition-all"
              >
                {link}
                {link === "Watchlist" && watchlist.length > 0 && (
                  <span className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 h-full relative">
        {/* Search input */}
        <Search isOpen={isSearch} onClose={() => setIsSearch(false)} />

        <div
          className={`flex items-center gap-4  ${isSearch ? "invisible" : undefined}`}
        >
          <button
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            onClick={() => setIsSearch(true)}
          >
            <Icon name="search" className="text-3xl!" />
          </button>
          
          {/* Conditional Auth UI */}
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
              <Button variant="primary" onClick={() => navigate("/signin")}>
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DesktopNav;
