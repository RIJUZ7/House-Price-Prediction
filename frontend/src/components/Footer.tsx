import React from 'react';
import { Home, Terminal, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-cyan-400/40 flex items-center justify-center">
                <Home className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white">
                NEXUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">ESTATE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Production-grade property intelligence integrating statistical geospatial regression,
              5-fold cross-validated ensemble models, and modern telemetry interfaces.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>FastAPI 0.115 • scikit-learn 1.9 • React 19</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              System Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <a href="#predictor" className="hover:text-cyan-300 transition-colors">
                  Valuation Studio
                </a>
              </li>
              <li>
                <a href="#analytics" className="hover:text-cyan-300 transition-colors">
                  Performance Telemetry
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-cyan-300 transition-colors">
                  Engineering Pipeline
                </a>
              </li>
              <li>
                <a href="#limitations" className="hover:text-cyan-300 transition-colors">
                  Dataset Provenance
                </a>
              </li>
            </ul>
          </div>

          {/* Developer API & Architecture */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              Developer APIs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <a
                  href="http://127.0.0.1:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>FastAPI Swagger Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>GET /api/health</span>
                </a>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/api/metadata"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>GET /api/metadata</span>
                </a>
              </li>
              <li>
                <a
                  href="http://127.0.0.1:8000/api/analytics"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>GET /api/analytics</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NEXUS ESTATE. MIT License. Built for ML engineering portfolio demonstration.</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Environment: Production Local</span>
            <span className="text-cyan-400 font-bold">R²: 0.844 Champion</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
