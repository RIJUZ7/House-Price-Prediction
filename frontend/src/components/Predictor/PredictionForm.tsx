import React from 'react';
import { 
  DollarSign, 
  Calendar, 
  Home, 
  Bed, 
  Users, 
  UserCheck, 
  Compass, 
  AlertCircle,
  Calculator,
  RefreshCw
} from 'lucide-react';
import type { PredictionInput } from '../../types/api';

interface PredictionFormProps {
  input: PredictionInput;
  onChange: (field: keyof PredictionInput, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
  error: string | null;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  input,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  error,
}) => {
  // Compute live derived ratio indicators
  const bedroomRatio = input.AveRooms > 0 ? (input.AveBedrms / input.AveRooms) : 0;
  const annualIncome = Math.round(input.MedInc * 10000);

  // Quick coordinate presets
  const handleSetCoords = (lat: number, lon: number) => {
    onChange('Latitude', lat);
    onChange('Longitude', lon);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* Field Set 1: Socio-Economic & Demographics */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            1. Demographics & Household Structure
          </span>
          <span className="text-[11px] text-slate-400">California Census Block Scale</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Median Income */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                Median Block Income
              </label>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {input.MedInc.toFixed(2)} ($10k)
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  ≈ ${annualIncome.toLocaleString()}/yr
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.05"
              value={input.MedInc}
              onChange={(e) => onChange('MedInc', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$5,000/yr</span>
              <span>$75,000/yr</span>
              <span>$150,000+/yr</span>
            </div>
          </div>

          {/* House Age */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
                Median Property Age
              </label>
              <span className="text-xs font-mono font-bold text-violet-300">
                {input.HouseAge} yrs
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="52"
              step="1"
              value={input.HouseAge}
              onChange={(e) => onChange('HouseAge', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 yr (Modern)</span>
              <span>28 yrs (Mature)</span>
              <span>52+ yrs (Historic)</span>
            </div>
          </div>

          {/* Population */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                Block Group Population
              </label>
              <span className="text-xs font-mono font-bold text-sky-300">
                {Math.round(input.Population).toLocaleString()} residents
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="50"
              value={input.Population}
              onChange={(e) => onChange('Population', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Low density (100)</span>
              <span>Suburban (1,400)</span>
              <span>Urban dense (10,000)</span>
            </div>
          </div>

          {/* Average Occupancy */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Average Household Occupancy
              </label>
              <span className="text-xs font-mono font-bold text-emerald-300">
                {input.AveOccup.toFixed(1)} people/unit
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.1"
              value={input.AveOccup}
              onChange={(e) => onChange('AveOccup', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Single (1.0)</span>
              <span>Family (3.0)</span>
              <span>Multi-gen (8.0)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Field Set 2: Structural Characteristics */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono uppercase text-violet-400 font-bold tracking-wider">
            2. Room Architecture & Density
          </span>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-400">Bed/Room Ratio:</span>
            <span className={`font-bold ${bedroomRatio > 0.4 ? 'text-amber-400' : 'text-cyan-400'}`}>
              {(bedroomRatio * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Average Rooms */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                Average Total Rooms
              </label>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {input.AveRooms.toFixed(1)} rooms
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="15.0"
              step="0.1"
              value={input.AveRooms}
              onChange={(e) => onChange('AveRooms', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Small apt (2.0)</span>
              <span>Standard (5.5)</span>
              <span>Spacious estate (15.0)</span>
            </div>
          </div>

          {/* Average Bedrooms */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-violet-400" />
                Average Bedrooms
              </label>
              <span className="text-xs font-mono font-bold text-violet-300">
                {input.AveBedrms.toFixed(2)} bedrooms
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max={Math.min(6.0, input.AveRooms)}
              step="0.05"
              value={input.AveBedrms}
              onChange={(e) => onChange('AveBedrms', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Studio (0.8)</span>
              <span>Typical (1.1)</span>
              <span>Large (4.0+)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Field Set 3: Spatial Coordinates & Geo-Context */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider">
            3. Geospatial Location (California Coordinates)
          </span>
          <span className="text-[11px] text-slate-400">Spatial Lat/Lon Regressors</span>
        </div>

        {/* Quick Regional Coordinate Fillers */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[11px] text-slate-400 py-1">Quick Hub:</span>
          <button
            type="button"
            onClick={() => handleSetCoords(37.77, -122.42)}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 transition-colors"
          >
            SF Bay [37.77, -122.42]
          </button>
          <button
            type="button"
            onClick={() => handleSetCoords(37.44, -122.16)}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 transition-colors"
          >
            Silicon Valley [37.44, -122.16]
          </button>
          <button
            type="button"
            onClick={() => handleSetCoords(34.05, -118.24)}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 transition-colors"
          >
            Los Angeles [34.05, -118.24]
          </button>
          <button
            type="button"
            onClick={() => handleSetCoords(32.71, -117.16)}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 transition-colors"
          >
            San Diego [32.71, -117.16]
          </button>
          <button
            type="button"
            onClick={() => handleSetCoords(36.75, -119.77)}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 transition-colors"
          >
            Central Valley [36.75, -119.77]
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Latitude */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Latitude
              </label>
              <span className="text-xs font-mono font-bold text-sky-300">
                {input.Latitude.toFixed(2)}° N
              </span>
            </div>
            <input
              type="range"
              min="32.5"
              max="42.0"
              step="0.01"
              value={input.Latitude}
              onChange={(e) => onChange('Latitude', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>32.5° N (San Diego border)</span>
              <span>42.0° N (Oregon border)</span>
            </div>
          </div>

          {/* Longitude */}
          <div className="glass-panel p-4 rounded-xl border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Longitude
              </label>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {input.Longitude.toFixed(2)}° W
              </span>
            </div>
            <input
              type="range"
              min="-124.5"
              max="-114.0"
              step="0.01"
              value={input.Longitude}
              onChange={(e) => onChange('Longitude', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>-124.5° W (Pacific Coast)</span>
              <span>-114.0° W (Nevada border)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Error banner if submission failed */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Valuation Calculation Failed</span>
            <p className="text-rose-300 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white glass-panel hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-7 py-3 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:brightness-110 shadow-glow-cyan active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Evaluating Model...</span>
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 text-slate-950" />
              <span>Execute Real-Time Valuation</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
