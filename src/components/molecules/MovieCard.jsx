import { useNavigate } from "react-router-dom";
import Badge from "../atoms/Badge";
import Genres from "../atoms/Genres";
import MovieRating from "../atoms/MovieRating";

const MovieCard = ({
  movie,
  variant = "vertical",
  rank,
  imageType = "poster",
}) => {
  const navigate = useNavigate();
  const isLandscape = imageType === "";
  const aspectClass = isLandscape ? "aspect-video" : "aspect-2/3";

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  // LAYOUT POPULAR
  if (variant === "horizontal") {
    return (
      <div
        className="group relative flex items-center gap- py-4 cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <span className="absolute -left-7 text-7xl lg:text-8xl font-black text-white/50 italic z-100 transition-colors group-hover:text-green-500/50 ">
          {rank}
        </span>

        <div className="relative z-10 aspect-2/3 w-28 lg:w-32 shrink-0 overflow-hidden rounded-xl shadow-lg">
          <img
            src={movie.poster}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={movie.title}
          />
        </div>

        <div className="z-10 flex flex-col justify-center pl-2.5">
          <Badge className="mb-2 w-fit bg-zinc-800 text-[10px] text-zinc-400 border-zinc-700">
            {movie.ageRating || "PG-13"}
          </Badge>

          <p className="text-white font-bold text-base lg:text-lg mb-2 line-clamp-1 group-hover:text-green-500 transition-colors">
            {movie.title}
          </p>

          <div className="flex flex-col gap-1.5">
            <Genres genres={movie.genres} icon />
            <div className="flex items-center gap-2">
              <MovieRating score={movie.rating} />
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500 text-xs">Movie</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT CARD VERTICAL
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
      onClick={handleClick}
    >
      <div className={`${aspectClass} w-full`}>
        <img
          src={isLandscape ? movie.backdrop : movie.poster}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-70"
          alt={movie.title}
        />
      </div>
      <div className="absolute -inset-px bg-linear-to-t from-black via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 p-3 flex flex-col justify-end z-20">
        <Badge className="w-fit mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Movie
        </Badge>
        <p className="font-body text-white font-bold text-sm lg:text-base mb-1 line-clamp-1">
          {movie.title}
        </p>
        <div className="flex items-center gap-2">
          <MovieRating score={movie.rating} />
          <span className="text-zinc-500 text-xs">|</span>
          <Genres genres={movie.genres} />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
