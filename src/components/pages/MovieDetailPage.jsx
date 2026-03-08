import { useParams, useLocation, Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import movieService from "../../services/tmdbService";
import MovieRating from "../atoms/MovieRating";
import Badge from "../atoms/Badge";
import Icon from "../atoms/Icon";
import CastCard from "../molecules/CastCard";
import MovieList from "../organisms/MovieList";
import useWatchlistStore from "../../store/useWatchlistStore";
import Button from "../atoms/Button";
import geminiService from "../../services/geminiService";
import toast from "react-hot-toast";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlistStore();
  
  const [aiReason, setAiReason] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchAiReason = async () => {
    setAiLoading(true);
    try {
        const prompt = `Give me a short, intriguing, 1-sentence reason why someone should watch the movie "${movie.title}". Focus on the vibe or unique selling point.`;
        const text = await geminiService.generateText(prompt);
        setAiReason(text);
        toast.success("AI Insight Generated!");
    } catch (error) {
        toast.error("Failed to get AI insight.");
    } finally {
        setAiLoading(false);
    }
  };

  const isWatching = location.pathname.endsWith("/watch");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMovieDetails(movieId, {
          extended: true,
        });
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie details:", error);
      } finally {
        setLoading(false);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-20">
        <h2 className="text-2xl font-bold mb-4 text-zinc-500 italic">
          Movie not found.
        </h2>
        <Link
          to="/"
          className="px-6 py-2 bg-green-600 rounded-full font-bold hover:bg-green-500 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 overflow-x-hidden">
      <div className="relative w-full overflow-hidden">
        {isWatching ? (
          <div className="pt-28 px-6 lg:px-16 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex justify-between items-center mb-6">
              <Link
                to={`/movie/${movieId}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-green-500 transition-colors group"
              >
                <Icon name="arrow_back" className="transition-transform group-hover:-translate-x-1" />
                <span className="font-medium tracking-wide">Back to Info</span>
              </Link>
              <h2 className="text-xl font-black text-green-500 truncate max-w-[60%] uppercase tracking-widest hidden md:block italic">
                {movie.title}
              </h2>
            </div>

            <div className="relative z-10">
              <Outlet context={{ movie, isWatching }} />
            </div>
          </div>
        ) : (
          <div className="relative h-[65vh] lg:h-[85vh] w-full transition-all duration-700">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover opacity-30 scale-105 blur-sm lg:blur-none transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-0" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <Link
                to={`/movie/${movieId}/watch`}
                className="group flex flex-col items-center gap-5 transition-transform hover:scale-110 active:scale-95 pointer-events-auto"
              >
                <div className="w-20 h-20 lg:w-28 lg:h-28 bg-green-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(22,163,74,0.4)] group-hover:bg-green-500 group-hover:shadow-[0_0_80px_rgba(22,163,74,0.6)] transition-all duration-300">
                  <Icon name="play_arrow" />
                </div>
                <span className="font-black tracking-[0.5em] uppercase text-xs text-white/60 group-hover:text-white transition-colors">
                  Start Watching
                </span>
              </Link>
            </div>

            {/* Poster & Title Overlay */}
            <div className="absolute bottom-0 left-0 w-full px-6 lg:px-16 pb-6 sm:pb-12 flex flex-col lg:flex-row items-end gap-4 sm:gap-10 z-10 pointer-events-none">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-44 lg:w-64 rounded-3xl shadow-2xl border border-white/10 hidden md:block transition-transform hover:scale-105 duration-500 pointer-events-auto"
                loading="lazy"
              />
              <div className="flex-1 pointer-events-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((genre) => (
                    <Badge key={genre}>{genre}</Badge>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black uppercase italic mb-5 leading-[0.9]">
                  {movie.title}
                </h1>
                <div className="flex items-center flex-wrap gap-3 sm:gap-8 text-zinc-300 mb-6">
                  <MovieRating score={movie.rating} />
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  <span className="font-bold tracking-widest">
                    {movie.runtime} MIN
                  </span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                  <span className="font-bold tracking-widest">
                    {movie.type}
                  </span>
                </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={inWatchlist ? "primary" : "outline"}
                        onClick={toggleWatchlist}
                        className="px-6 py-3 rounded-full! gap-2 flex items-center border border-white/20 hover:border-green-500"
                      >
                        <Icon name={inWatchlist ? "check" : "add"} />
                        {inWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={fetchAiReason}
                        disabled={aiLoading || aiReason}
                        className="px-6 py-3 rounded-full! gap-2 flex items-center border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500"
                      >
                        <Icon name="auto_awesome" className={aiLoading ? "animate-spin" : ""} />
                        {aiLoading ? "Thinking..." : "Why Watch This?"}
                      </Button>
                    </div>

                    {aiReason && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl max-w-xl">
                            <p className="text-purple-200 italic font-medium">
                                <span className="text-2xl mr-2">✨</span>
                                {aiReason}
                            </p>
                        </div>
                    )}
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SHARED CONTENT GRID */}
      <div className="px-6 lg:px-16 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-20">
          <section className="animate-in fade-in slide-in-from-left-6 duration-700">
            <h3 className="text-3xl font-black mb-6 text-green-500 flex items-center gap-4 italic uppercase tracking-tighter">
              <span className="w-12 h-1 bg-green-500 rounded-full"></span>
              Storyline
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xl italic lg:pr-12 border-l-2 border-zinc-900 pl-8">
              {movie.desc ||
                "The plot description for this movie is currently under wraps."}
            </p>
          </section>

          <section className="animate-in fade-in slide-in-from-left-10 duration-700">
            <h3 className="text-3xl font-black mb-8 text-green-500 flex items-center gap-4 italic uppercase tracking-tighter">
              <span className="w-12 h-1 bg-green-500 rounded-full"></span>
              Top Cast
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {movie.cast?.map((person) => (
                <CastCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-16 animate-in fade-in slide-in-from-right-6 duration-700">
          <section>
            <h3 className="text-xs font-bold mb-6 uppercase tracking-[0.4em] text-zinc-600">
              Official Preview
            </h3>
            {movie.trailer ? (
              <div className="aspect-video rounded-4xl overflow-hidden border border-white/5 shadow-2xl group cursor-pointer">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${movie.trailer}?modestbranding=1&rel=0`}
                  title="Official Trailer"
                  frameBorder="0"
                  allowFullScreen
                  className="transition-transform duration-700 group-hover:scale-110"
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-zinc-900/50 rounded-4xl flex items-center justify-center text-zinc-700 border border-dashed border-zinc-800 italic">
                Trailer Unavailable
              </div>
            )}
          </section>

          {/* Detailed Statistics Sidebar */}
          <div className="bg-zinc-900/40 p-5 sm:p-10 rounded-[2.5rem] border border-white/5 space-y-8">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
              <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                Global Status
              </span>
              <span className="text-green-500 font-black tracking-tight uppercase">
                {movie.status || "Released"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                Audio / Lang
              </span>
              <span className="text-zinc-300 font-bold uppercase">
                {movie.language || "English"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMILAR MOVIES */}
      <div className="mt-32">
        <MovieList title="Discover More Like This" movies={movie.similar} />
      </div>
    </div>
  );
};

export default MovieDetailPage;
