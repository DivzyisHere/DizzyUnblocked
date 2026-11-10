import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export const HeroFeatured = ({ game, onPlay, onOpenJsonModal }) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 md:p-10 border border-slate-800 shadow-xl">
      {/* Subtle grid pattern backdrop */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Featured Title of the Week</span>
            <span aria-hidden="true">·</span>
            <span>{game.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            {game.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            {game.description}
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
            <span>Rating: <strong className="text-white font-mono">{game.rating} / 5.0</strong></span>
            <span aria-hidden="true">·</span>
            <span>Plays: <strong className="text-white font-mono">{game.plays}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Controls: <span className="text-slate-300">{game.controls}</span></span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => onPlay(game)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Game</span>
            </button>

            <button
              onClick={onOpenJsonModal}
              className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              View JSON Schema
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div 
            onClick={() => onPlay(game)}
            className="w-full max-w-sm aspect-video bg-slate-950/80 border border-slate-700/80 rounded-xl p-5 flex flex-col justify-between group hover:border-emerald-500/60 transition-all cursor-pointer shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Ready to Play
              </span>
              <span className="text-xs text-slate-400 font-mono">
                iframe embed
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Click to Start
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero download · Instant load
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>{game.category}</span>
              <span className="font-mono text-emerald-400">{game.rating} ★</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
