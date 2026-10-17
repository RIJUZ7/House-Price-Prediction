import React from 'react';
import { Database, Cpu, GitBranch, Binary, Layers } from 'lucide-react';

export const Methodology: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Data Ingestion & Sanitization',
      icon: Database,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      description:
        'Programmatically loads 20,640 census block group samples from the California Housing repository. Audits column data types, ensures 0 null/NaN values, and establishes boundary constraints.',
      details: [
        'Deterministic random seed (42) for 100% reproducibility',
        'Automatic local CSV caching fallback',
        'Continuous schema validation on load',
      ],
    },
    {
      step: '02',
      title: 'Leak-Free Feature Engineering',
      icon: Binary,
      color: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      description:
        'Splits data into train (80%) and held-out test (20%) prior to any transformations. Constructs domain ratio signals and economic proximity metrics inside a scikit-learn Pipeline.',
      details: [
        'BedroomsPerRoom = AveBedrms / AveRooms',
        'PeoplePerRoom = AveOccup / AveRooms',
        'Euclidean distance approximations to SF & LA hubs',
      ],
    },
    {
      step: '03',
      title: '5-Fold Cross-Validation',
      icon: GitBranch,
      color: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      description:
        'Evaluates Dummy Baseline, Ridge Linear Regression, Random Forest, and Hist Gradient Boosting across 5 K-Fold partitions. Model selection is performed strictly on validation scores.',
      details: [
        'Hist Gradient Boosting selected as champion (CV R²: 0.843)',
        'Unbiased evaluation on unseen test partition (R²: 0.844)',
        'Comprehensive MAE, RMSE, and R² tracking',
      ],
    },
    {
      step: '04',
      title: 'Production Serving & Telemetry',
      icon: Cpu,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      description:
        'The champion pipeline is serialized with joblib into models/. FastAPI serves high-throughput inference endpoints with Pydantic contract validation and empirical confidence bounds.',
      details: [
        'Sub-millisecond model inference from memory',
        '90% empirical residual confidence intervals',
        'Interactive real-time Recharts telemetry dashboards',
      ],
    },
  ];

  return (
    <section id="methodology" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>RIGOROUS MACHINE LEARNING WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Reproducible Engineering Pipeline
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            From raw census survey data to container-ready inference APIs: how NEXUS ESTATE
            guarantees statistical integrity and prevents data leakage.
          </p>
        </div>

        {/* 4 Architecture Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className={`glass-panel p-6 rounded-2xl border ${item.borderColor} hover:bg-slate-900/80 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-600">
                      {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-semibold">
                    Key Implementations
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 font-mono">
                    {item.details.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
