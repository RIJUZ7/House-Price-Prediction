import React from 'react';
import { AlertTriangle, Info, Map, BookOpen } from 'lucide-react';

export const DatasetLimitations: React.FC = () => {
  return (
    <section id="limitations" className="py-20 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & STATISTICAL LIMITATIONS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Dataset Provenance & Domain Nuance
          </h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Essential contextual knowledge regarding the California Housing dataset, census geography,
            and valuation boundaries.
          </p>
        </div>

        {/* 3 Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Block Group vs. Parcel Appraisal
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The California Housing dataset models <span className="text-cyan-300 font-semibold">Census Block Groups</span>—the smallest geographic unit published by the U.S. Census Bureau (~600 to 3,000 residents). Predictions characterize median neighborhood market levels rather than a certified appraisal for an individual street address.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Target Scale: $100k Multiplier
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The regression target <code className="text-violet-300 font-mono">MedHouseVal</code> is measured in hundreds of thousands of dollars (<span className="text-violet-300 font-semibold">1.0 = $100,000 USD</span>). NEXUS ESTATE transforms outputs to standard currency notation while displaying the raw mathematical multiplier for full auditability.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Capped Ceiling ($500,000+)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In the 1990 U.S. Census survey collection, residential values exceeding $500,000 were top-coded at <code className="text-amber-300 font-mono">5.00001</code>. This right-censoring produces the distinct frequency spike observed in the distribution charts, which our gradient-boosted trees handle with robustness.
            </p>
          </div>

        </div>

        {/* Technical Placement & Interview Highlight Box */}
        <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-cyan-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block mb-1">
                Candidate Portfolio & Interview Talking Point
              </span>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                When discussing this project in engineering interviews, emphasize that recognizing target-scale constraints and preventing feature leakage during cross-validation demonstrates real-world software engineering discipline over naive notebook scripts.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/30 whitespace-nowrap">
            scikit-learn 1.9+ | FastAPI 0.115+
          </div>
        </div>

      </div>
    </section>
  );
};
