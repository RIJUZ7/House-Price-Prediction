import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Sliders, 
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { PredictionResult as ResultType } from '../../types/api';

interface PredictionResultProps {
  result: ResultType;
}

export const PredictionResultCard: React.FC<PredictionResultProps> = ({ result }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#06b6d4', '#8b5cf6', '#38bdf8'],
      });
    } catch {
      // Ignore if canvas not supported
    }
  }, [result.predicted_value_usd]);

  const testMetrics = result.test_metrics;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-400/30 glass-panel-glow relative overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none -z-10" />

      {/* Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
              Valuation Computed
            </span>
            <p className="text-[11px] text-slate-400">California Census Block Group Estimate</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {result.model_name}
          </span>
        </div>
      </div>

      {/* Main Valuation Display */}
      <div className="text-center py-6 px-4 bg-slate-900/60 rounded-2xl border border-slate-800 mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
          Predicted Median Block Group Value
        </span>
        <div className="text-4xl sm:text-6xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-300 tracking-tight my-2">
          {result.predicted_value_formatted}
        </div>
        <p className="text-xs font-mono text-cyan-400/90 mt-1">
          Raw Target Index: <span className="text-white font-bold">{result.predicted_raw.toFixed(4)}</span> × $100,000 USD
        </p>

        {/* Confidence Interval Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          <span>90% Confidence Interval:</span>
          <span className="font-bold text-white">
            ${Math.round(result.confidence_interval.lower_bound_usd).toLocaleString()}
          </span>
          <span className="text-slate-500">—</span>
          <span className="font-bold text-white">
            ${Math.round(result.confidence_interval.upper_bound_usd).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Model Benchmark Performance Tags */}
      {testMetrics && (
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Test R² Score</span>
            <span className="text-base font-bold font-mono text-cyan-300">
              {(testMetrics.r2 * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Test RMSE</span>
            <span className="text-base font-bold font-mono text-violet-300">
              ${Math.round(testMetrics.rmse_usd).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Test MAE</span>
            <span className="text-base font-bold font-mono text-emerald-300">
              ${Math.round(testMetrics.mae_usd).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Input Audit & Derived Characteristics */}
      <div className="space-y-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider block mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Applied Input Parameters
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Median Income:</span>
              <span className="text-white font-bold">${(result.input_summary.MedInc * 10000).toLocaleString()}/yr</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">House Age:</span>
              <span className="text-white font-bold">{result.input_summary.HouseAge} yrs</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Rooms / Bedrms:</span>
              <span className="text-white font-bold">{result.input_summary.AveRooms} / {result.input_summary.AveBedrms}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Coordinates:</span>
              <span className="text-white font-bold">{result.input_summary.Latitude.toFixed(2)}, {result.input_summary.Longitude.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Derived Spatial & Ratio Indicators */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
          <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold block mb-2">
            Engineered Geographic & Structural Indicators
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block">Bedrooms Ratio:</span>
              <span className="text-slate-200 font-semibold">
                {(result.derived_features.BedroomsPerRoom * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">People/Room:</span>
              <span className="text-slate-200 font-semibold">
                {result.derived_features.PeoplePerRoom.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Dist to SF Hub:</span>
              <span className="text-slate-200 font-semibold">
                {result.derived_features.DistToSF_deg.toFixed(2)}°
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Dist to LA Hub:</span>
              <span className="text-slate-200 font-semibold">
                {result.derived_features.DistToLA_deg.toFixed(2)}°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-300 block mb-0.5">Model Limitation Note</span>
          <p className="text-[11px]">
            {result.disclaimer}
          </p>
        </div>
      </div>

    </motion.div>
  );
};
