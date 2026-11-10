import React, { useState, useEffect, useMemo } from 'react';
import defaultGamesData from './data/games.json';
import { Navbar } from './components/Navbar.jsx';
import { HeroFeatured } from './components/HeroFeatured.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonManagerModal } from './components/JsonManagerModal.jsx';
import { StealthModal } from './components/StealthModal.jsx';
import { PanicScreen } from './components/PanicScreen.jsx';
import { applyTabCloak } from './utils/cloak.js';
import { Search, SlidersHorizontal, Gamepad2, Heart, Plus } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('playvault_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('playvault_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('playvault_theme', 'light');
    }
  }, [darkMode]);

  // Tab cloak preset
  const [cloakPreset, setCloakPreset] = useState(() => {
    return localStorage.getItem('playvault_cloak') || 'default';
  });

  useEffect(() => {
    applyTabCloak(cloakPreset);
    localStorage.setItem('playvault_cloak', cloakPreset);
  }, [cloakPreset]);

  // Games state (master games list merged with custom additions)
  const [games, setGames] = useState(() => {
    const savedCustom = localStorage.getItem('playvault_custom_games');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          // Merge custom games on top of default
          return [...defaultGamesData, ...parsed];
        }
      } catch (e) {
        console.error('Failed to parse saved games:', e);
      }
    }
    return defaultGamesData;
  });

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('playvault_favorites');
      return saved ? JSON.parse(saved) : ['2048', 'retro-snake'];
    } catch {
      return ['2048', 'retro-snake'];
    }
  });

  useEffect(() => {
    localStorage.setItem('playvault_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Navigation & filter states
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [activeGame, setActiveGame] = useState(null);

  // Panic stealth mode
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  // Global key listener for panic mode (Esc key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPanicActive(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Favorite toggle handler
  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add custom game handler
  const handleAddGame = (newGame) => {
    const updated = [newGame, ...games];
    setGames(updated);
    
    // Save custom games in localStorage
    const customList = updated.filter(g => g.isCustom);
    localStorage.setItem('playvault_custom_games', JSON.stringify(customList));

    // Switch to playing it immediately
    setActiveGame(newGame);
  };

  // Update raw JSON
  const handleUpdateGames = (newGames) => {
    setGames(newGames);
    const customList = newGames.filter(g => g.isCustom);
    localStorage.setItem('playvault_custom_games', JSON.stringify(customList));
  };

  // Reset to default JSON
  const handleResetToDefault = () => {
    localStorage.removeItem('playvault_custom_games');
    setGames(defaultGamesData);
    setIsJsonModalOpen(false);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set();
    games.forEach(g => set.add(g.category));
    return ['All', ...Array.from(set)];
  }, [games]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Tab filter
        if (activeTab === 'favorites') {
          if (!favorites.includes(game.id)) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && game.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchCategory = game.category.toLowerCase().includes(q);
          const matchTag = game.tags?.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchCategory || matchTag;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        // Default: most popular (or plays)
        const parsePlays = (p) => {
          if (typeof p === 'string' && p.endsWith('K')) return parseFloat(p) * 1000;
          return parseFloat(p) || 0;
        };
        return parsePlays(b.plays) - parsePlays(a.plays);
      });
  }, [games, activeTab, favorites, selectedCategory, searchQuery, sortBy]);

  // Featured game for the hero banner
  const featuredGame = useMemo(() => {
    return games.find(g => g.featured) || games[0];
  }, [games]);

  if (isPanicActive) {
    return <PanicScreen onExitPanic={() => setIsPanicActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar following 3-Zone Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (activeGame) setActiveGame(null);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        favoritesCount={favorites.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If a game is active, render GamePlayer */}
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
            allGames={games}
            onSelectGame={(g) => setActiveGame(g)}
          />
        ) : (
          <>
            {/* Hero spotlight when browsing All games and no search active */}
            {activeTab === 'all' && !searchQuery && selectedCategory === 'All' && (
              <HeroFeatured
                game={featuredGame}
                onPlay={(g) => setActiveGame(g)}
                onOpenJsonModal={() => setIsJsonModalOpen(true)}
              />
            )}

            {/* Filter, Search & Segmented controls bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search games by title, tag, or controls (Press /)..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="alpha">Alphabetical</option>
                  </select>
                </div>
              </div>

              {/* Category Segmented Control Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat && activeTab !== 'favorites';
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (activeTab === 'favorites') setActiveTab('all');
                      }}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}

                <button
                  onClick={() => setActiveTab(activeTab === 'favorites' ? 'all' : 'favorites')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'favorites'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-white' : ''}`} />
                  <span>Favorites ({favorites.length})</span>
                </button>
              </div>
            </div>

            {/* Games Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Showing <strong className="text-slate-900 dark:text-white font-mono">{filteredGames.length}</strong> {filteredGames.length === 1 ? 'game' : 'games'}
                  {activeTab === 'favorites' && ' in favorites'}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Game</span>
                </button>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={(g) => setActiveGame(g)}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={(id, e) => handleToggleFavorite(id, e)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <Gamepad2 className="w-12 h-12 mx-auto text-slate-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No games found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    {searchQuery
                      ? `No games matched "${searchQuery}". Try a different keyword or category.`
                      : 'You do not have any saved games matching this filter.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setActiveTab('all');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Dizzy Unblocked</span>
            <span aria-hidden="true">·</span>
            <span>Unblocked iframe game catalog</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              JSON Store (/src/data/games.json)
            </button>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Tab Cloak Settings
            </button>
            <button
              onClick={() => setIsPanicActive(true)}
              className="hover:text-rose-500 transition-colors cursor-pointer"
            >
              Emergency Disguise
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onUpdateGames={handleUpdateGames}
        onResetToDefault={handleResetToDefault}
      />

      <StealthModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        currentPreset={cloakPreset}
        onSelectPreset={setCloakPreset}
        onTriggerPanic={() => setIsPanicActive(true)}
      />
    </div>
  );
}
