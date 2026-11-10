import React from 'react';
import { X, ShieldCheck, EyeOff } from 'lucide-react';
import { applyTabCloak } from '../utils/cloak.js';

export const StealthModal = ({
  isOpen,
  onClose,
  currentPreset,
  onSelectPreset,
  onTriggerPanic,
}) => {
  if (!isOpen) return null;

  const presets = [
    { id: 'default', name: 'Dizzy Unblocked (Default)', desc: 'Standard site title and game controller favicon' },
    { id: 'classroom', name: 'Google Classroom', desc: 'Disguises tab as "Classes - Google Classroom"' },
    { id: 'docs', name: 'Google Docs', desc: 'Disguises tab as "Biology Notes Q3 - Google Docs"' },
    { id: 'canvas', name: 'Canvas LMS', desc: 'Disguises tab as "Dashboard · Canvas LMS"' },
    { id: 'wikipedia', name: 'Wikipedia', desc: 'Disguises tab as "Polynomial interpolation - Wikipedia"' },
  ];

  const handleChoose = (preset) => {
    onSelectPreset(preset);
    applyTabCloak(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tab Cloaking & Stealth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Disguise your browser tab & hotkeys
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

        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Tab Cloak Preset:
          </label>

          <div className="space-y-2">
            {presets.map(p => {
              const active = currentPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleChoose(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/60'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {active && (
                        <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {p.desc}
                    </div>
                  </div>
                  {active && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Key Notice */}
        <div className="mt-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
              Panic Hotkey
            </span>
            <kbd className="px-2 py-0.5 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded shadow-xs">
              Escape
            </kbd>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
            Pressing <kbd className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Esc</kbd> at any time instantly hides the game and displays a realistic assignment note document.
          </p>
          <button
            onClick={() => {
              onClose();
              onTriggerPanic();
            }}
            className="w-full mt-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
          >
            Test Panic Screen Now
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
