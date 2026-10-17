import React from 'react';
import { Home, Sparkles, Activity, BarChart3, BookOpen, Cpu } from 'lucide-react';
import type { HealthStatus } from '../types/api';

interface NavbarProps {
  health: HealthStatus | null;
  isLoadingHealth: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, isLoadingHealth, onNavigate }) => {
  const isOnline = health?.model_loaded;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-cyan-500/20 bg-nexus-bg/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <div 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-violet-600/30 border border-cyan-400/40 group-hover:border-cyan-400 group-hover:shadow-glow-cyan transition-all duration-300">
              <Home className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <Sparkles className="w-3 h-3 text-violet-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  NEXUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">ESTATE</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  AI v1.0
                </span>
              </div>
              <p className="text-[11px] text-nexus-textMuted tracking-tight">AI-Powered Property Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onNavigate('predictor')}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              Valuation Studio
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 transition-all flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Live Telemetry
            </button>
            <button
              onClick={() => onNavigate('methodology')}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              Architecture
            </button>
          </div>

          {/* Live Status Beacon & Quick CTA */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div 
              title={isOnline ? `Model: ${health?.model_name || 'Active'}` : 'FastAPI Backend Offline - Start backend server'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                isOnline
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : isLoadingHealth
                  ? 'bg-slate-900 border-slate-700 text-slate-400'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? 'bg-emerald-400' : isLoadingHealth ? 'bg-amber-400' : 'bg-rose-500'
                }`}></span>
              </span>
              <span className="hidden sm:inline">
                {isOnline ? 'ONLINE: HistGradBoost' : isLoadingHealth ? 'Connecting...' : 'API OFFLINE'}
              </span>
            </div>

            {/* Launch Valuation CTA */}
            <button
              onClick={() => onNavigate('predictor')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:brightness-110 shadow-glow-cyan active:scale-95 transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-slate-950" />
              <span>Estimate Value</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
