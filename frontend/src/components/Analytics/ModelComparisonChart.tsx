import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import type { ModelCandidate } from '../../types/api';

interface ModelComparisonChartProps {
  data: ModelCandidate[];
}

export const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ data }) => {
  const [metricKey, setMetricKey] = useState<'r2' | 'rmse'>('r2');

  const formattedData = data.map((item) => ({
    name: item.name.replace(' Regressor', ''),
    r2_pct: Number((Math.max(0, item.r2_cv_mean) * 100).toFixed(1)),
    rmse_k: Math.round(item.rmse_cv_usd / 1000),
    mae_k: Math.round(item.mae_cv_usd / 1000),
    isChampion: Boolean(item.is_selected_champion),
    type: item.type,
  }));

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            5-Fold Cross-Validation Model Benchmark
          </h3>
          <p className="text-xs text-slate-400">
            Strict validation comparison across candidate regression families
          </p>
        </div>

        {/* Metric Selector Toggle */}
        <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setMetricKey('r2')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metricKey === 'r2'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CV R² Accuracy (%)
          </button>
          <button
            type="button"
            onClick={() => setMetricKey('rmse')}
            className={`px-3 py-1 rounded-lg transition-all ${
              metricKey === 'rmse'
                ? 'bg-violet-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CV RMSE ($k USD)
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              interval={0}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => metricKey === 'r2' ? `${v}%` : `$${v}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/40 text-xs shadow-xl font-mono">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-white">{item.name}</span>
                        {item.isChampion && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px]">
                            Champion
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">Category: {item.type}</p>
                      <p className="text-cyan-300">
                        CV R² Score: <span className="font-bold text-white">{item.r2_pct}%</span>
                      </p>
                      <p className="text-violet-300">
                        CV RMSE: <span className="font-bold text-white">${item.rmse_k.toLocaleString()},000</span>
                      </p>
                      <p className="text-emerald-300">
                        CV MAE: <span className="font-bold text-white">${item.mae_k.toLocaleString()},000</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey={metricKey === 'r2' ? 'r2_pct' : 'rmse_k'}
              radius={[6, 6, 0, 0]}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`comp-cell-${index}`}
                  fill={
                    entry.isChampion
                      ? '#22d3ee'
                      : metricKey === 'r2'
                      ? '#0284c7'
                      : '#8b5cf6'
                  }
                  fillOpacity={entry.isChampion ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono border-t border-slate-800/80 pt-2">
        <span className="text-cyan-400 font-semibold">
          ★ Selected Champion: Hist Gradient Boosting (CV R²: 84.3%, CV RMSE: $45.8k)
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Evaluation protocol: 5-Fold K-Fold Cross-Validation
        </span>
      </div>
    </div>
  );
};
