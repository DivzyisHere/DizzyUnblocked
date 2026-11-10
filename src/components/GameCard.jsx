import React from 'react';
import { Play, Heart, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <article
      onClick={() => onPlay(game)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Top Banner / Graphic representation */}
      <div 
        className="relative h-36 w-full flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${game.themeColor || '#334155'}22, ${game.themeColor || '#0f172a'}44)`,
        }}
      >
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
          style={{
            backgroundColor: `${game.themeColor || '#10b981'}25`,
            color: game.themeColor || '#10b981',
          }}
        >
          <Gamepad2 className="w-7 h-7" />
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors cursor-pointer ${
            isFavorite
              ? 'text-rose-500 bg-white/90 dark:bg-slate-800/90 shadow-sm'
              : 'text-slate-400 hover:text-rose-500 bg-slate-900/40 hover:bg-slate-900/70 backdrop-blur-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Play hover overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md">
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Play Now</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>{game.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-600 dark:text-amber-400">{game.rating} ★</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{game.plays} plays</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {game.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate max-w-[190px]">
            {game.controls}
          </span>
          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
            {game.isCustom ? 'Custom' : 'HTML5'}
          </span>
        </div>
      </div>
    </article>
  );
};
