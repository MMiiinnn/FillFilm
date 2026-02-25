import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Button from "../atoms/Button";
import useWatchlistStore from "../../store/useWatchlistStore";
import Icon from "../atoms/Icon";

const HeroSection = ({ movies }) => {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlistStore();

  if (!movies || movies.length === 0)
    return <div className="h-screen bg-black" />;

  const handleNavigate = (id) => {
    navigate(`/movie/${id}`);
  };

  const toggleWatchlist = (e, movie) => {
    e.stopPropagation();
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <section className="h-[75vh] lg:h-screen w-full bg-black">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={800}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="hero-swiper h-full w-full"
      >
        {movies.slice(0, 6).map((movie) => {
          const inWatchlist = isInWatchlist(movie.id);
          return (
            <SwiperSlide key={movie.id} className="border-none">
              <div className="relative h-full w-full">
                {/* Backdrop */}
                <img
                  src={movie.backdrop}
                  className="absolute inset-0 w-full h-full object-cover object-top  origin-center"
                  alt={movie.title}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16 max-w-3xl">
                  <h1
                    className="text-4xl lg:text-7xl font-bold text-white mb-4 cursor-pointer hover:text-green-500 transition-colors"
                    onClick={() => handleNavigate(movie.id)}
                  >
                    {movie.title}
                  </h1>
                  <p className="text-gray-300 text-sm lg:text-lg mb-8 line-clamp-3">
                    {movie.desc}{" "}
                    <span
                      className="text-green-500 cursor-pointer hover:underline"
                      onClick={() => handleNavigate(movie.id)}
                    >
                      Read more
                    </span>
                  </p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="primary"
                      icon="play_arrow"
                      className="px-6 py-3 rounded-md! font-bold!"
                      onClick={() => handleNavigate(movie.id)}
                    >
                      Watch Now
                    </Button>

                    <Button
                      variant={inWatchlist ? "primary" : "outline"}
                      onClick={(e) => toggleWatchlist(e, movie)}
                      className="px-6 py-3 rounded-md! gap-2 flex items-center"
                    >
                      <Icon name={inWatchlist ? "check" : "add"} />
                      {inWatchlist ? "Added" : "Watchlist"}
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default HeroSection;
