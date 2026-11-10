import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export const AddGameModal = ({ isOpen, onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('Mouse and Keyboard');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe embed tag or game URL.');
      return;
    }

    let cleanIframe = iframeInput.trim();
    let url = '';

    if (cleanIframe.startsWith('<iframe')) {
      const srcMatch = cleanIframe.match(/src=["'](.*?)["']/);
      if (srcMatch && srcMatch[1]) {
        url = srcMatch[1];
      } else {
        setError('Invalid iframe tag: missing src attribute.');
        return;
      }
    } else if (cleanIframe.startsWith('http://') || cleanIframe.startsWith('https://') || cleanIframe.startsWith('/')) {
      url = cleanIframe;
      cleanIframe = `<iframe src="${url}" title="${title}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
    } else {
      setError('Please enter a valid URL (https://...) or <iframe> code snippet.');
      return;
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom user-imported browser game.',
      iframe: cleanIframe,
      iframeUrl: url,
      controls: controls.trim() || 'Standard game controls',
      rating: 5.0,
      plays: '1',
      tags: [category, 'Custom'],
      themeColor: '#10b981',
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Add Game to Catalog
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste an iframe embed code or HTML5 game URL to add to the JSON store
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Game Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Slope 3D, Slope Runner"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Controls Summary
              </label>
              <input
                type="text"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                placeholder="e.g. Arrow keys to steer"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Iframe Embed Code or URL
            </label>
            <textarea
              rows={3}
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              placeholder='<iframe src="https://..." width="100%" height="100%"></iframe>'
              className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              required
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              You can paste full &lt;iframe&gt; HTML code or just the direct URL.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fast-paced game with high score system..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save to Games JSON</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
