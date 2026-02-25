import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import MovieCard from "../molecules/MovieCard";
import MovieCardSkeleton from "../atoms/MovieCardSkeleton";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const MovieList = ({
  title,
  movies = [],
  variant = "default",
  imageType = "poster",
  isLoading = false,
}) => {
  const isPopular = variant === "popular";
  const isLandscape = imageType === "landscape";
  const skeletonCount = 6;

  return (
    <section className="py-10 px-6 lg:px-16 overflow-hidden">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl lg:text-4xl text-white tracking-wider uppercase border-l-4 border-green-500 pl-4">
            {title}
          </h2>
          <button className="font-body text-green-500 text-sm font-bold hover:text-green-400 transition-colors">
            VIEW ALL
          </button>
        </div>
      )}

      <Swiper
        modules={[FreeMode, Navigation]}
        spaceBetween={isPopular ? 50 : 20}
        slidesPerView={"auto"}
        freeMode={true}
        navigation={false}
        breakpoints={{
          1024: { navigation: true },
        }}
        className="movie-swiper"
      >
        {isLoading
          ? // Show Skeleton
            [...Array(skeletonCount)].map((_, i) => (
              <SwiperSlide
                key={`skeleton-${i}`}
                className={
                  isLandscape
                    ? "w-[320px]! lg:w-100!"
                    : "w-66! md:w-55! lg:w-65!"
                }
              >
                <MovieCardSkeleton
                  variant={isPopular ? "horizontal" : "vertical"}
                />
              </SwiperSlide>
            ))
          : // Show data
            movies.map((movie, index) => (
              <SwiperSlide
                key={movie.id}
                className={
                  isLandscape
                    ? "w-[320px]! lg:w-100!"
                    : "w-66! md:w-55! lg:w-65!"
                }
              >
                <MovieCard
                  movie={movie}
                  variant={isPopular ? "horizontal" : "vertical"}
                  imageType={imageType}
                  rank={index + 1}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
};

export default MovieList;
