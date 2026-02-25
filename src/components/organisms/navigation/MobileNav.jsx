import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../atoms/Icon";
import Input from "../../atoms/Input";

function MobileNav({ isOpenSidebar }) {
  const [isSearch, setIsSearch] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (isSearch) {
        setIsSearch(false);
        // Optional: Blur input if we had a ref
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearch]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearch(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <nav
        className={`flex lg:hidden justify-between items-center w-full px-2 transition-all duration-500 ease-in-out bg-transparent!
          ${isSearch ? "opacity-0 invisible -translate-x-5" : "opacity-100 visible translate-x-0"}`}
      >
        <h1 
          className="text-4xl p-3 cursor-pointer hover:text-green-500 transition-colors" 
          onClick={() => navigate("/")}
        >
          FillFilm
        </h1>
        <div className="flex gap-1">
          <button className="p-3" onClick={() => setIsSearch(true)}>
            <Icon name="search" className="text-3xl!" />
          </button>
          <button className="p-3" onClick={() => isOpenSidebar(true)}>
            <Icon name="density_medium" className="text-3xl!" />
          </button>
        </div>
      </nav>

      <div
        className={`absolute inset-0 flex items-center gap-2 py-2 px-3 bg-zinc-950/95 backdrop-blur-md transition-all duration-500 ease-in-out z-10
          ${isSearch ? "w-full opacity-100 translate-y-0" : "w-full opacity-0 -translate-y-full pointer-events-none"}`}
      >
        <button 
          className="p-1 shrink-0 text-zinc-400 hover:text-white" 
          onClick={() => setIsSearch(false)}
        >
          <Icon name="arrow_back_ios" className="text-2xl!" />
        </button>
        <div className="flex-1 min-w-0">
          <Input
            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-zinc-500 font-body h-12 focus:ring-0! focus:border-none!"
            placeholder="Search movies..."
            autoFocus={isSearch}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {query && (
           <button 
             onClick={() => setQuery("")}
             className="p-2 text-zinc-500 hover:text-red-500"
           >
             <Icon name="close" className="text-xl" />
           </button>
        )}
         <button 
             onClick={handleSearch}
             className="p-2 text-green-500 font-bold"
           >
             GO
           </button>
      </div>
    </>
  );
}

export default MobileNav;
