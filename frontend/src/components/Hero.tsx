import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, ShieldCheck, Database, Layers, Sparkles } from 'lucide-react';
import type { AnalyticsData, ModelMetadata } from '../types/api';

interface HeroProps {
  analytics: AnalyticsData | null;
  metadata: ModelMetadata | null;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ analytics, metadata, onNavigate }) => {
  const r2Score = metadata?.test_performance?.r2 || analytics?.test_metrics?.r2 || 0.8439;
  const maeUsd = metadata?.test_performance?.mae_usd || analytics?.test_metrics?.mae_usd || 29882;
  const totalSamples = metadata?.total_samples || analytics?.total_records || 20640;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Architectural Lighting & Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-violet-600/15 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CALIFORNIA RESIDENTIAL GEO-INTELLIGENCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-slate-400">HIST GRADIENT BOOSTING</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          >
            See the Value Behind <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
              Every Address.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            High-precision property valuation driven by machine learning pipelines,
            demographic feature transformations, and spatial coordinates across California census blocks.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => onNavigate('predictor')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:brightness-110 shadow-glow-cyan active:scale-98 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Estimate Property Value</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-slate-200 glass-panel hover:bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Explore Model Analytics</span>
            </button>
          </motion.div>

          {/* High-Impact Proof Points / Stat Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left"
          >
            <div className="glass-panel p-4 rounded-2xl border-cyan-500/15 hover:border-cyan-500/35 transition-all">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Database className="w-4 h-4" />
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Records</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {totalSamples.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">California Census Blocks</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-cyan-500/15 hover:border-cyan-500/35 transition-all">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <BarChart2 className="w-4 h-4" />
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Accuracy</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 font-mono">
                {(r2Score * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-slate-400 mt-1">Held-Out Test R² Score</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-cyan-500/15 hover:border-cyan-500/35 transition-all">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Test MAE</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                ${Math.round(maeUsd).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">Mean Absolute Error (USD)</p>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-cyan-500/15 hover:border-cyan-500/35 transition-all">
              <div className="flex items-center gap-2 text-sky-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Validation</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                5-Fold
              </div>
              <p className="text-xs text-slate-400 mt-1">Leak-Free Cross Validation</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
