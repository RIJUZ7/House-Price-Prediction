import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import type { PropertyPreset } from '../../types/api';

interface PresetsBarProps {
  presets: PropertyPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: PropertyPreset) => void;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase font-mono">
            California Archetype Presets
          </h3>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">Click to prefill input parameters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan text-white'
                  : 'glass-panel border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {preset.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 font-medium">
                  {preset.tag}
                </span>
                <span className="text-slate-400">
                  ${(preset.values.MedInc * 10).toFixed(0)}k inc
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
