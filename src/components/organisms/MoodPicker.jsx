import { useState } from "react";
import geminiService from "../../services/geminiService";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";
import toast from "react-hot-toast";
import tmdbService from "../../services/tmdbService";
import { Link } from "react-router-dom";

const MOODS = [
  { label: "Happy", icon: "sentiment_satisfied", color: "bg-yellow-500" },
  { label: "Sad", icon: "sentiment_dissatisfied", color: "bg-blue-500" },
  { label: "Excited", icon: "celebration", color: "bg-red-500" },
  { label: "Relaxed", icon: "self_improvement", color: "bg-purple-500" },
  { label: "Thoughtful", icon: "psychology", color: "bg-green-500" },
  { label: "Scared", icon: "sentiment_very_dissatisfied", color: "bg-gray-700" },
];

const MoodPicker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState([]);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setRecommendations([]);
    setMovieData([]);

    try {
      const prompt = `I am feeling ${mood.label}. Recommend 5 specific movies for this mood. Return ONLY a valid JSON array of objects, where each object has a "title" and a short "reason". Do not use Markdown formatting. Example: [{"title": "Movie Name", "reason": "Because..."}]`;
      
      const responseText = await geminiService.generateText(prompt);
      
      // Clean up response if it wraps in markdown code blocks
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const recs = JSON.parse(cleanJson);
      setRecommendations(recs);

      if (!Array.isArray(recs)) throw new Error("Invalid AI response format");

      const moviePromises = recs.map(async (rec) => {
        const searchResults = await tmdbService.search(rec.title);
        const movie = searchResults.find(m => m.type === "Movie");
         return movie ? { ...movie, reason: rec.reason } : null;
      });

      const movies = (await Promise.all(moviePromises)).filter(m => m !== null);
      setMovieData(movies);
      
      if (movies.length === 0) {
        toast.error("AI found movies, but we couldn't find them in our database.");
      }

    } catch (error) {
      console.error("Mood Picker Error:", error);
      toast.error("Failed to get recommendations. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-6 lg:px-16 bg-zinc-950 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-5xl font-black uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 animate-in fade-in slide-in-from-bottom-4">
            How are you feeling?
          </h2>
          <p className="text-zinc-400 text-lg">
            Select your mood and let AI pick the perfect movie for you.
          </p>
        </div>

        {/* Mood Grid */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-110
                ${selectedMood?.label === mood.label 
                  ? `${mood.color} text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110` 
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
            >
              <Icon name={mood.icon} className="text-2xl" />
              <span className="font-bold uppercase tracking-wide">{mood.label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 animate-pulse">Requesting picks from Gemini...</p>
          </div>
        )}

        {/* Results */}
        {!loading && movieData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {movieData.map((movie) => (
              <Link 
                to={`/movie/${movie.id}`} 
                key={movie.id}
                className="group relative bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2"
              >
                  <div className="aspect-[2/3] overflow-hidden">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        loading="lazy" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button variant="primary" className="scale-0 group-hover:scale-100 transition-transform duration-300">
                             View Details
                          </Button>
                      </div>
                  </div>
                  <div className="p-4">
                      <h3 className="font-bold text-white truncate mb-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mb-3">
                        <Icon name="star" className="text-sm" />
                        {movie.rating}
                      </div>
                      <p className="text-xs text-zinc-400 italic line-clamp-3 border-t border-zinc-800 pt-2">
                        "{movie.reason}"
                      </p>
                  </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MoodPicker;
