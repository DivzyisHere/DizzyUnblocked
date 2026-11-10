import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  ExternalLink, 
  Heart, 
  ArrowLeft, 
  Tv, 
  Code, 
  Info, 
  Check, 
  Copy,
  SlidersHorizontal
} from 'lucide-react';
import { openAboutBlank } from '../utils/cloak.js';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectGame,
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [showJsonSnippet, setShowJsonSnippet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeContainerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return;
    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  };

  const handleReload = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(game, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine iframe src
  const src = game.iframeUrl || (game.iframe.match(/src=["'](.*?)["']/)?.[1] ?? '');

  const otherGames = allGames.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Player Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-amber-500">{game.rating} ★</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {game.title}
            </h2>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? "Remove favorite" : "Add to favorites"}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleReload}
            title="Reload game iframe"
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={() => setIsTheater(prev => !prev)}
            title="Toggle Theater Mode"
            className={`p-2 border rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
              isTheater
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">Theater</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Full Screen"
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            onClick={() => openAboutBlank(src, game.title)}
            title="Open in cloaked about:blank tab"
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden md:inline">Cloaked Tab</span>
          </button>
        </div>
      </div>

      {/* Main Game Iframe Viewport */}
      <div 
        ref={iframeContainerRef}
        className={`relative mx-auto transition-all duration-300 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center ${
          isTheater 
            ? 'w-full h-[85vh] max-w-full' 
            : 'w-full max-w-4xl aspect-[16/10] min-h-[500px]'
        }`}
      >
        <iframe
          key={`${game.id}-${reloadKey}`}
          src={src}
          title={game.title}
          className="w-full h-full border-0 block"
          allow="autoplay; fullscreen; keyboard; gamepad"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        />
      </div>

      {/* Game Details & Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-500" />
              <span>Game Information</span>
            </h3>

            <button
              onClick={() => setShowJsonSnippet(prev => !prev)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer font-medium"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJsonSnippet ? 'Hide JSON entry' : 'View in JSON'}</span>
            </button>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {game.description}
          </p>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
              <span>Keyboard & Touch Controls</span>
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {game.controls}
            </div>
          </div>

          {showJsonSnippet && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">
                  Entry from games.json:
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono bg-slate-950 text-emerald-300 p-3 rounded-lg overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(game, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Similar / Up Next Games */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              More Popular Games
            </h3>
            <div className="space-y-2">
              {otherGames.map(og => (
                <button
                  key={og.id}
                  onClick={() => onSelectGame(og)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {og.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {og.category} · {og.rating} ★
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Play →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            All games run in hermetic iframes with zero tracking or pop-ups.
          </div>
        </div>
      </div>
    </div>
  );
};
