import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { SampleComparison } from '../../types/api';

interface ActualVsPredictedChartProps {
  data: SampleComparison[];
}

export const ActualVsPredictedChart: React.FC<ActualVsPredictedChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    actual: Math.round(item.actual),
    predicted: Math.round(item.predicted),
    actual_k: Math.round(item.actual / 1000),
    predicted_k: Math.round(item.predicted / 1000),
    error_k: Math.round(item.residual / 1000),
    abs_error_k: Math.round(item.abs_error / 1000),
  }));

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Actual vs. Predicted Valuation Scatter
          </h3>
          <p className="text-xs text-slate-400">
            Held-out test sample points evaluated against perfect 1:1 parity line
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300">
          Held-out Test Set
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="actual_k"
              name="Actual"
              stroke="#64748b"
              fontSize={11}
              domain={[0, 520]}
              tickFormatter={(v) => `$${v}k`}
              label={{ value: 'Actual District Value ($k)', position: 'insideBottom', offset: -12, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis
              type="number"
              dataKey="predicted_k"
              name="Predicted"
              stroke="#64748b"
              fontSize={11}
              domain={[0, 520]}
              tickFormatter={(v) => `$${v}k`}
              label={{ value: 'Predicted Value ($k)', angle: -90, position: 'insideLeft', offset: 12, fill: '#64748b', fontSize: 10 }}
            />
            <ZAxis range={[25, 25]} />
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 520, y: 520 }]}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 text-xs shadow-xl font-mono">
                      <p className="text-cyan-300 mb-1">
                        Actual: <span className="font-bold text-white">${pt.actual.toLocaleString()}</span>
                      </p>
                      <p className="text-violet-300 mb-1">
                        Predicted: <span className="font-bold text-white">${pt.predicted.toLocaleString()}</span>
                      </p>
                      <p className={`text-[11px] font-bold ${Math.abs(pt.error_k) > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        Residual Deviation: {pt.error_k >= 0 ? '+' : ''}${pt.error_k}k
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Predictions"
              data={chartData}
              fill="#22d3ee"
              fillOpacity={0.7}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono border-t border-slate-800/80 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
          Held-out Test Blocks (n=120 Sample)
        </span>
        <span className="text-rose-400">
          --- Red Dashed Line: Parity (Actual = Predicted)
        </span>
      </div>
    </div>
  );
};
