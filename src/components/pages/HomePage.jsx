import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroSection from "../organisms/HeroSection";
import MovieList from "../organisms/MovieList";
import tmdbService from "../../services/tmdbService";
import AwardSection from "../organisms/AwardSection";
import MoodPicker from "../organisms/MoodPicker";

function Home() {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    topRated: [],
    nowPlaying: [],
    upComing: [],
    trendingMovie: [],
    popularTV: [],
    topToday: [],
    koreanTVSeries: [],
    movieDetails: [],
  });

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const [
        trending,
        popular,
        topRated,
        nowPlaying,
        upComing,
        trendingMovie,
        popularTV,
        topToday,
        koreanTVSeries,
      ] = await Promise.all([
        tmdbService.getTrending(),
        tmdbService.getPopular(),
        tmdbService.getTopRated(),
        tmdbService.getNowPlaying(),
        tmdbService.getUpComing(),
        tmdbService.getTrendingMovies(),
        tmdbService.getPopularTV(),
        tmdbService.getTopToday(),
        tmdbService.getKoreanTVSeries(),
      ]);

      let details = null;
      if (topRated && topRated.length > 0) {
        const firstMovieId = topRated[0].id;
        details = await tmdbService.getMovieDetails(firstMovieId);
      }

      setMovies((preState) => ({
        ...preState,
        trending,
        popular,
        topRated,
        nowPlaying,
        upComing,
        trendingMovie,
        popularTV,
        topToday,
        koreanTVSeries,
        movieDetails: details,
      }));
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500); // Delay to ensure content is loaded
      }
    }
  }, [location, loading]);

  return (
    <>
      <HeroSection movies={movies.trending} />
      <MoodPicker />
      <MovieList
        title="Just Release"
        movies={movies.nowPlaying}
        isLoading={loading}
      />
      <MovieList
        title=" Top 10 today"
        movies={movies.topToday}
        variant="popular"
        isLoading={loading}
      />
      <MovieList
        title="Korean Series"
        movies={movies.koreanTVSeries}
        imageType="landscape"
        isLoading={loading}
      />
      <MovieList
        title="Popular"
        movies={movies.popular}
        variant="popular"
        isLoading={loading}
      />
      <MovieList
        title="Movies"
        movies={movies.trendingMovie}
        imageType="landscape"
        isLoading={loading}
      />

      <MovieList
        title="TV Series"
        movies={movies.popularTV}
        imageType="landscape"
        isLoading={loading}
      />

      {/* Add getMovieDetails */}

      <AwardSection
        awardMovies={movies.movieDetails}
        fastMovies={movies.popular}
        liveMovies={movies.trending}
        isLoading={loading}
      />

      <div id="upcoming">
        <MovieList
          title="Upcoming Movies"
          movies={movies.upComing}
          isLoading={loading}
        />
      </div>
      <MovieList
        title="Trending Series"
        movies={movies.topRated}
        isLoading={loading}
      />
    </>
  );
}

export default Home;
