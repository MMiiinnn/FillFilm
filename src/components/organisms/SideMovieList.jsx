import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import Genres from "../atoms/Genres";

const SidebarMovieList = ({ title, movies, isLive = false }) => {
  const listRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (listRef.current) {
      const scrollAmount = direction === "up" ? -320 : 320;
      listRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  const handleClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const hoverBorderColor = isLive
    ? "group-hover:border-red-500"
    : "group-hover:border-green-500";
  const hoverTextColor = isLive
    ? "group-hover:text-red-500"
    : "group-hover:text-green-500";

  return (
    <div className="lg:col-span-3 flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl lg:text-2xl font-heading font-bold uppercase flex items-center gap-2 text-white">
          {title}
          {isLive && (
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          )}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => handleScroll("up")}>
            <Icon name="chevron_left" className="rotate-90 lg:rotate-0" />
          </Button>
          <Button variant="ghost" onClick={() => handleScroll("down")}>
            <Icon name="chevron_right" className="rotate-90 lg:rotate-0" />
          </Button>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex flex-col gap-6 h-100 lg:h-137.5 overflow-y-auto no-scrollbar scroll-smooth"
      >
        {movies?.map((movie) => (
          <div
            key={movie.id}
            className="flex gap-4 group cursor-pointer shrink-0"
            onClick={() => handleClick(movie.id)}
          >
            <div
              className={`w-16 h-24 lg:w-20 lg:h-28 shrink-0 rounded-xl overflow-hidden border-2 border-transparent ${hoverBorderColor} transition-all duration-300`}
            >
              <img
                src={movie.poster}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                alt={movie.title}
                loading="lazy"
              />
            </div>

            <div className="flex flex-col justify-center gap-1 min-w-0">
              <Badge className="mb-1 w-fit bg-zinc-800 text-[10px] text-zinc-400 border-zinc-700">
                {movie.ageRating || "PG-13"}
              </Badge>
              <h4
                className={`font-bold text-sm text-white truncate ${hoverTextColor} transition-colors`}
              >
                {movie.title}
              </h4>
              <Genres genres={movie.genres} icon limit={2} />
              <div className="flex items-center gap-1 text-xs mt-1">
                <Icon name="star" className="text-yellow-500 text-[10px]" />
                <span className="font-bold text-white">{movie.rating}</span>
                <span className="text-zinc-500 ml-1">
                  | {isLive ? "Live" : "Movie"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarMovieList;
