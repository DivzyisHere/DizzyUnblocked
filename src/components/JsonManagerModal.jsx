import React, { useState } from 'react';
import { X, Copy, Download, RotateCcw, Check, FileJson } from 'lucide-react';

export const JsonManagerModal = ({
  isOpen,
  onClose,
  games,
  onUpdateGames,
  onResetToDefault,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(games, null, 2));
  const [parseError, setParseError] = useState(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(games, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "games.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleStartEdit = () => {
    setJsonText(JSON.stringify(games, null, 2));
    setParseError(null);
    setIsEditing(true);
  };

  const handleSaveJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setParseError('Root element must be a JSON array of games.');
        return;
      }
      // Check that items have id and iframe
      for (const item of parsed) {
        if (!item.id || (!item.iframe && !item.iframeUrl)) {
          setParseError(`Game "${item.title || 'unnamed'}" must have an "id" and "iframe" (or "iframeUrl") attribute.`);
          return;
        }
      }
      onUpdateGames(parsed);
      setIsEditing(false);
      setParseError(null);
    } catch (err) {
      setParseError(`JSON Syntax Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                games.json Catalog Store
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {games.length} games configured as hermetic iframes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Edit Raw JSON
              </button>
            ) : (
              <button
                onClick={handleSaveJson}
                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors shadow-sm cursor-pointer"
              >
                Apply & Save JSON
              </button>
            )}

            <button
              onClick={onResetToDefault}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>
          </div>
        </div>

        {parseError && (
          <div className="mx-5 mt-3 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {parseError}
          </div>
        )}

        {/* Content Box */}
        <div className="p-5 flex-1 overflow-auto">
          {isEditing ? (
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-80 font-mono text-xs p-3.5 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-none"
              spellCheck={false}
            />
          ) : (
            <pre className="font-mono text-xs p-4 bg-slate-950 text-emerald-300 border border-slate-800 rounded-xl overflow-x-auto max-h-80 leading-relaxed">
              {JSON.stringify(games, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Target file: <code className="text-emerald-600 dark:text-emerald-400 font-mono">/src/data/games.json</code> & <code className="text-emerald-600 dark:text-emerald-400 font-mono">/public/games.json</code></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
