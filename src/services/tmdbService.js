import api, { getImageUrl } from "./apiConfig";

let genreMap = null;
let genreMapPromise = null;

/**
 * @returns {Promise<Map<number, string>>} Map of genreId → genreName
 */
const getGenreMap = async () => {
  if (genreMap) return genreMap;

  if (!genreMapPromise) {
    genreMapPromise = (async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          api.get("/genre/movie/list"),
          api.get("/genre/tv/list"),
        ]);

        const map = new Map();
        movieGenres.genres?.forEach((g) => map.set(g.id, g.name));
        tvGenres.genres?.forEach((g) => map.set(g.id, g.name));

        genreMap = map;
        return map;
      } catch (error) {
        console.error("Failed to fetch genre list:", error);
        return new Map();
      }
    })();
  }

  return genreMapPromise;
};

/**
 * @param {number[]} genreIds - Array of TMDB genre IDs.
 * @returns {string[]} Array of genre name strings.
 */
const resolveGenres = (genreIds) => {
  if (!genreIds || !genreMap) return [];
  return genreIds
    .map((id) => genreMap.get(id))
    .filter(Boolean);
};

const tmdbService = {
  /**
   * @param {Object} movie - Raw movie/tv object from TMDB API.
   * @returns {Object} Transformed movie object with standardized fields.
   */
  transformMovie: (movie) => ({
    id: movie.id,
    title: movie.title || movie.name,
    desc: movie.overview,
    poster: getImageUrl(movie.poster_path),
    backdrop: getImageUrl(movie.backdrop_path, "original"),
    rating: movie.vote_average?.toFixed(1) || "0.0",
    genres: resolveGenres(movie.genre_ids),
    type: movie.media_type === "tv" ? "TV Series" : "Movie",
    ageRating: movie.adult ? "R" : "PG-13",
  }),

  /**
   * Fetches trending movies and TV shows for the day.
   * @returns {Promise<Array>} List of transformed movies/TV shows.
   */
  getTrending: async () => {
    await getGenreMap();
    const data = await api.get("/trending/all/day");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches the current popular movies.
   * @returns {Promise<Array>} List of transformed popular movies.
   */
  getPopular: async () => {
    await getGenreMap();
    const data = await api.get("/movie/popular");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches top-rated movies of all time.
   * @returns {Promise<Array>} List of transformed top-rated movies.
   */
  getTopRated: async () => {
    await getGenreMap();
    const data = await api.get("/movie/top_rated");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches movies currently in theaters (Now Playing).
   * @returns {Promise<Array>} List of transformed now playing movies.
   */
  getNowPlaying: async () => {
    await getGenreMap();
    const data = await api.get("/movie/now_playing");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches upcoming movies.
   * @returns {Promise<Array>} List of transformed upcoming movies.
   */
  getUpComing: async () => {
    await getGenreMap();
    const data = await api.get("/movie/upcoming");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches trending movies specifically for the week.
   * @returns {Promise<Array>} List of transformed trending movies.
   */
  getTrendingMovies: async () => {
    await getGenreMap();
    const data = await api.get("/trending/movie/week");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches popular TV shows.
   * @returns {Promise<Array>} List of transformed popular TV shows.
   */
  getPopularTV: async () => {
    await getGenreMap();
    const data = await api.get("/tv/popular");
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches the top 10 trending items for the "Top Today" section.
   * @returns {Promise<Array>} List of top 10 transformed items.
   */
  getTopToday: async () => {
    await getGenreMap();
    const data = await api.get("/trending/all/day");
    return data.results.slice(0, 10).map(tmdbService.transformMovie);
  },

  /**
   * Fetches popular Korean TV Series (K-Drama).
   * @returns {Promise<Array>} List of transformed K-Dramas.
   */
  getKoreanTVSeries: async () => {
    await getGenreMap();
    const data = await api.get("/discover/tv", {
      params: {
        with_original_language: "ko",
        sort_by: "popularity.desc",
        page: 1,
      },
    });
    return data.results.map(tmdbService.transformMovie);
  },

  /**
   * Fetches full details for a specific movie or TV show.
   * @param {number|string} movieId - The TMDB ID of the content.
   * @param {Object} [options] - Optional settings.
   * @param {boolean} [options.extended=false] - If true, fetches Cast, Videos, and Similar movies.
   * @returns {Promise<Object|null>} Detailed movie object or null if failed.
   */
  getMovieDetails: async (movieId, options = { extended: false }) => {
    try {
      await getGenreMap();
      const { extended } = options;

      const params = {};
      if (extended) {
        params.append_to_response = "videos,credits,similar";
      }

      const data = await api.get(`/movie/${movieId}`, { params });

      // Basic data convert
      const movie = tmdbService.transformMovie(data);

      // Return combined object (Merge light and heavy data
      return {
        ...movie,
        runtime: data.runtime,
        genres: data.genres?.map((g) => g.name) || [],

        // Only process large arrays if extended = true
        ...(extended && {
          cast: data.credits?.cast?.slice(0, 8).map((c) => ({
            id: c.id,
            name: c.name,
            profile: getImageUrl(c.profile_path),
            character: c.character,
          })),
          trailer: data.videos?.results?.find((v) => v.type === "Trailer")?.key,
          similar: data.similar?.results
            ?.slice(0, 6)
            .map(tmdbService.transformMovie),
        }),
      };
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phim:", error);
      return null;
    }
  },

  /**
   * Searches for movies and TV shows matching the query.
   * @param {string} query - Use search text.
   * @returns {Promise<Array>} List of transformed search results (Movies & TV only).
   */
  search: async (query) => {
    if (!query) return [];
    await getGenreMap();
    const data = await api.get("/search/multi", {
      params: {
        query: query,
        include_adult: false,
        language: "en-US",
        page: 1,
      },
    });
    
    return data.results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map(tmdbService.transformMovie);
  },
};

export default tmdbService;
