import React, { useState } from 'react';
import { FileText, ArrowLeft, Printer, Share2 } from 'lucide-react';

export const PanicScreen = ({ onExitPanic }) => {
  const [docContent, setDocContent] = useState(
`Lab Report 04: Cellular Respiration & ATP Synthesis
Date: November 9, 2026
Student ID: 492019-BIO

1. Abstract & Objectives
The primary purpose of this experimental assay is to observe the metabolic rate of Saccharomyces cerevisiae under varying glucose concentrations. By measuring carbon dioxide gas production via respirometers, we quantify the kinetics of anaerobic glycolysis versus oxidative phosphorylation.

2. Materials & Experimental Setup
- 10% and 20% D-Glucose stock solutions
- Standard graduated fermentation tubes (25 mL)
- Active dry yeast suspension (1.5% w/v)
- Water bath maintained at 37.0°C ± 0.5°C
- Barometric sensor and digital stopwatch

3. Data Collection (Table 1)
Time (min) | Trial A (0% Glu) | Trial B (10% Glu) | Trial C (20% Glu)
0 min      | 0.0 mL CO2       | 0.0 mL CO2        | 0.0 mL CO2
5 min      | 0.1 mL CO2       | 1.4 mL CO2        | 2.2 mL CO2
10 min     | 0.1 mL CO2       | 3.1 mL CO2        | 4.9 mL CO2
15 min     | 0.2 mL CO2       | 5.2 mL CO2        | 7.8 mL CO2

4. Discussion & Error Sources
Consistent with the predicted Michaelis-Menten kinetics, the substrate saturation occurred near the 18-minute mark. Minor errors may stem from temperature fluctuations during meniscus readings.`
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 flex flex-col font-sans select-text">
      {/* Fake Google Docs Top Bar */}
      <header className="bg-white dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Biology Lab 4 - Respiration Notes</span>
              <span className="text-xs text-slate-400">Saved to Drive</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
              <span className="hover:underline cursor-pointer">File</span>
              <span className="hover:underline cursor-pointer">Edit</span>
              <span className="hover:underline cursor-pointer">View</span>
              <span className="hover:underline cursor-pointer">Insert</span>
              <span className="hover:underline cursor-pointer">Format</span>
              <span className="hover:underline cursor-pointer">Tools</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full cursor-pointer">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </div>
        </div>
      </header>

      {/* Document Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-100 dark:bg-zinc-950">
        <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 shadow-lg min-h-[800px] p-8 md:p-14 rounded-xs font-serif text-slate-800 dark:text-zinc-200">
          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className="w-full h-full min-h-[700px] bg-transparent resize-none focus:outline-none font-serif text-sm md:text-base leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Inconspicuous return button in lower bar */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <span>Page 1 of 1 · 184 words</span>
        
        <button
          onClick={onExitPanic}
          className="flex items-center gap-1.5 px-3 py-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-sans font-medium rounded transition-colors cursor-pointer"
          title="Return to Dizzy Unblocked"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Disguise (Esc)</span>
        </button>
      </footer>
    </div>
  );
};
