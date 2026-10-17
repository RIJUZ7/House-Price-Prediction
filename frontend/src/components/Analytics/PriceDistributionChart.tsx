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
} from 'recharts';
import type { PriceDistributionBin } from '../../types/api';

interface PriceDistributionChartProps {
  data: PriceDistributionBin[];
}

export const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({ data }) => {
  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Target Value Distribution (MedHouseVal)
          </h3>
          <p className="text-xs text-slate-400">
            Historical median property values across California census block groups ($ USD)
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-300">
          20,640 records
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="range"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(v) => `${v.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as PriceDistributionBin;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 text-xs shadow-xl font-mono">
                      <p className="font-bold text-cyan-300 mb-1">{item.range}</p>
                      <p className="text-slate-300">
                        Block Groups: <span className="font-bold text-white">{item.count.toLocaleString()}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {((item.count / 20640) * 100).toFixed(1)}% of total census blocks
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === data.length - 1 ? '#a855f7' : '#06b6d4'}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono border-t border-slate-800/80 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block"></span>
          Standard Distribution
        </span>
        <span className="flex items-center gap-1.5 text-violet-300">
          <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block"></span>
          Capped Census Ceiling ($500k+)
        </span>
      </div>
    </div>
  );
};
