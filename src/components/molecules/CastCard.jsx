const CastCard = ({ person }) => {
  return (
    <div className="flex items-center gap-4 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800/60 transition-colors">
      <img
        src={person.profile || "https://via.placeholder.com/150?text=No+Image"}
        alt={person.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-green-500/20"
        loading="lazy"
      />
      <div className="overflow-hidden">
        <p className="font-bold text-sm text-white truncate">{person.name}</p>
        <p className="text-xs text-zinc-500 truncate">{person.character}</p>
      </div>
    </div>
  );
};

export default CastCard;
