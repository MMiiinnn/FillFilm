import { useNavigate } from "react-router-dom";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import MovieRating from "../atoms/MovieRating";
import { formatRuntime } from "../helpers/formatRuntime";
import { getImageUrl } from "../../services/apiConfig";
import Genres from "../atoms/Genres";
import SideMovieList from "./SideMovieList";
import useWatchlistStore from "../../store/useWatchlistStore";

const AwardSection = ({
  awardMovies: featuredMovie,
  fastMovies,
  liveMovies,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlistStore();

  // Ensure we have valid movie data
  const isDataReady = !isLoading && featuredMovie && featuredMovie.id;

  if (!isDataReady) {
    return <div className="h-150 bg-zinc-900 animate-pulse rounded-xl" />;
  }

  const rank = featuredMovie.vote_average?.toFixed(1) || "0.0";
  const isWatchlisted = isInWatchlist(featuredMovie.id);

  const handleWatchlist = () => {
    if (isWatchlisted) {
      removeFromWatchlist(featuredMovie.id);
    } else {
      addToWatchlist(featuredMovie);
    }
  };

  const handlePlay = () => {
    navigate(`/movie/${featuredMovie.id}/watch`);
  };

  return (
    <section className="px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-black text-white overflow-hidden">
      {/* FEATURED MOVIE */}
      <div className="lg:col-span-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold uppercase tracking-wider text-brand-green">
            Featured Selection
          </h2>
        </div>

        <div className="relative group overflow-hidden rounded-2xl aspect-video mb-6 cursor-pointer" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>
          <img
            src={getImageUrl(featuredMovie.backdrop_path || featuredMovie.backdrop, "original")}
            alt={featuredMovie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>

        <div className="space-y-4">
          {featuredMovie.tagline && (
            <Badge className="block mb-2 w-fit bg-zinc-800 text-[10px] text-zinc-400 border-zinc-700">
              {featuredMovie.tagline}
            </Badge>
          )} 
          {/* Note: If no tagline, fallback to 'Top Rated' logic or just hide */}
          {!featuredMovie.tagline && (
             <Badge className="block mb-2 w-fit bg-zinc-800 text-[10px] text-zinc-400 border-zinc-700">
             Top Rated
           </Badge>
          )}

          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-none cursor-pointer hover:text-brand-green transition-colors" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>
            {featuredMovie.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
            <MovieRating score={rank} />
            {featuredMovie.runtime && (
              <span>| {formatRuntime(featuredMovie.runtime)}</span>
            )}
            <span>| {featuredMovie.release_date?.split("-")[0]}</span>

            <Genres genres={featuredMovie.genres} />
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 max-w-xl">
            {featuredMovie.overview || featuredMovie.desc}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              variant="primary"
              icon="play_arrow"
              className="px-8 py-3 rounded-xl!"
              onClick={handlePlay}
            >
              Play Now
            </Button>
            <Button
              variant={isWatchlisted ? "primary" : "outline"} // Visual feedback
              icon={isWatchlisted ? "check" : "bookmark"}
              className={`px-8 py-3 rounded-xl! ${isWatchlisted ? 'bg-green-600/20 text-green-500 border-green-500' : ''}`}
              onClick={handleWatchlist}
            >
              {isWatchlisted ? "In Watchlist" : "Add Watchlist"}
            </Button>
          </div>
        </div>
      </div>

      {/* FAST */}
      <SideMovieList title="Popular Selection" movies={fastMovies} />

      {/* LIVE */}
      <SideMovieList title="Trending Now" movies={liveMovies} isLive={true} />
    </section>
  );
};

export default AwardSection;
