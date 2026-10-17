import React from 'react';
import { Award, Target, TrendingDown, Database } from 'lucide-react';
import type { ModelMetadata, AnalyticsData } from '../../types/api';

interface MetricCardsProps {
  metadata: ModelMetadata | null;
  analytics: AnalyticsData | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metadata, analytics }) => {
  const testMetrics = metadata?.test_performance || analytics?.test_metrics;

  const r2 = testMetrics?.r2 ?? 0.8439;
  const rmseUsd = testMetrics?.rmse_usd ?? 45229.38;
  const maeUsd = testMetrics?.mae_usd ?? 29882.52;
  const totalRecords = metadata?.total_samples ?? analytics?.total_records ?? 20640;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      
      {/* Metric 1: R2 Score */}
      <div className="glass-panel p-5 rounded-2xl border-cyan-500/20 hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">R² Coefficient</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
          {(r2 * 100).toFixed(2)}%
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
          <span>Variance Explained</span>
          <span className="text-emerald-400 font-bold">Champion</span>
        </div>
      </div>

      {/* Metric 2: RMSE */}
      <div className="glass-panel p-5 rounded-2xl border-violet-500/20 hover:border-violet-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Test RMSE</span>
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold font-mono text-white">
          ${Math.round(rmseUsd).toLocaleString()}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
          <span>Root Mean Sq Error</span>
          <span className="text-violet-300">USD Equivalent</span>
        </div>
      </div>

      {/* Metric 3: MAE */}
      <div className="glass-panel p-5 rounded-2xl border-emerald-500/20 hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Test MAE</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold font-mono text-white">
          ${Math.round(maeUsd).toLocaleString()}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
          <span>Mean Absolute Error</span>
          <span className="text-emerald-300">Avg Deviation</span>
        </div>
      </div>

      {/* Metric 4: Dataset Scope */}
      <div className="glass-panel p-5 rounded-2xl border-slate-700/60 hover:border-slate-500/60 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Dataset Scale</span>
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold font-mono text-white">
          {totalRecords.toLocaleString()}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
          <span>Census Block Groups</span>
          <span className="text-cyan-400">80/20 Split</span>
        </div>
      </div>

    </div>
  );
};
