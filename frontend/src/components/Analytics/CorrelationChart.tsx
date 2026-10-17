import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';

interface CorrelationChartProps {
  correlations: Record<string, { corr_with_target: number }>;
}

export const CorrelationChart: React.FC<CorrelationChartProps> = ({ correlations }) => {
  const chartData = Object.entries(correlations)
    .filter(([key]) => key !== 'MedHouseVal')
    .map(([feature, stats]) => ({
      feature,
      correlation: stats.corr_with_target,
    }))
    .sort((a, b) => b.correlation - a.correlation);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Feature Correlation with Property Valuation
          </h3>
          <p className="text-xs text-slate-400">
            Pearson linear correlation coefficient (r) with target block-group price
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-violet-300">
          Pearson (r)
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              domain={[-0.3, 0.8]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              width={75}
            />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 text-xs shadow-xl font-mono">
                      <p className="font-bold text-white mb-1">{pt.feature}</p>
                      <p className={pt.correlation >= 0 ? 'text-cyan-300' : 'text-rose-300'}>
                        Correlation: <span className="font-bold">{pt.correlation > 0 ? '+' : ''}{pt.correlation}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {pt.feature === 'MedInc' ? 'Dominant pricing signal (+0.69)' : 'Secondary demographic feature'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`corr-cell-${index}`}
                  fill={entry.correlation >= 0 ? '#06b6d4' : '#f43f5e'}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono border-t border-slate-800/80 pt-2">
        <span className="text-cyan-400">
          Positive: MedInc (+0.69), AveRooms (+0.15)
        </span>
        <span className="text-rose-400">
          Negative: Latitude (-0.14), AveBedrms (-0.05)
        </span>
      </div>
    </div>
  );
};
