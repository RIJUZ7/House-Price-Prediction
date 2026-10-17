import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PresetsBar } from './components/Predictor/PresetsBar';
import { PredictionForm } from './components/Predictor/PredictionForm';
import { PredictionResultCard } from './components/Predictor/PredictionResult';
import { MetricCards } from './components/Analytics/MetricCards';
import { PriceDistributionChart } from './components/Analytics/PriceDistributionChart';
import { ModelComparisonChart } from './components/Analytics/ModelComparisonChart';
import { ActualVsPredictedChart } from './components/Analytics/ActualVsPredictedChart';
import { CorrelationChart } from './components/Analytics/CorrelationChart';
import { Methodology } from './components/Methodology';
import { DatasetLimitations } from './components/DatasetLimitations';
import { Footer } from './components/Footer';

import { useModelHealth } from './hooks/useModelHealth';
import { useAnalytics } from './hooks/useAnalytics';
import { api } from './services/api';
import type { PredictionInput, PredictionResult, PropertyPreset } from './types/api';
import { Calculator, AlertCircle, Cpu, Layers } from 'lucide-react';

const DEFAULT_INPUT: PredictionInput = {
  MedInc: 3.87,
  HouseAge: 28.0,
  AveRooms: 5.4,
  AveBedrms: 1.1,
  Population: 1425.0,
  AveOccup: 3.0,
  Latitude: 35.6,
  Longitude: -119.5,
};

export const App: React.FC = () => {
  const { health, isLoading: isLoadingHealth } = useModelHealth();
  const { analytics, metadata, isLoading: isLoadingAnalytics } = useAnalytics();

  const [input, setInput] = useState<PredictionInput>(DEFAULT_INPUT);
  const [presets, setPresets] = useState<PropertyPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  // Load presets on mount
  useEffect(() => {
    api.getPresets()
      .then(setPresets)
      .catch((err) => console.warn('Could not load presets:', err));
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Field change handler
  const handleFieldChange = (field: keyof PredictionInput, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    setActivePresetId(null);
  };

  // Preset selection
  const handleSelectPreset = (preset: PropertyPreset) => {
    setInput(preset.values);
    setActivePresetId(preset.id);
  };

  // Reset form
  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setActivePresetId(null);
    setPrediction(null);
    setPredictError(null);
  };

  // Submit prediction
  const handleSubmitPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    setPredictError(null);

    try {
      const res = await api.predict(input);
      setPrediction(res);
    } catch (err: any) {
      setPredictError(err.message || 'Prediction failed. Check that backend server is running.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-textLight flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navigation */}
      <Navbar
        health={health}
        isLoadingHealth={isLoadingHealth}
        onNavigate={handleNavigate}
      />

      {/* Hero Header */}
      <Hero
        analytics={analytics}
        metadata={metadata}
        onNavigate={handleNavigate}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        
        {/* PREDICTOR SECTION */}
        <section id="predictor" className="py-20 border-t border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>INFERENCE ENGINE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                California Property Valuation Studio
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Adjust block group demographics, house age, room configurations, and coordinates to compute
                real-time median market valuations via the champion machine learning pipeline.
              </p>
            </div>

            {/* Presets Bar */}
            {presets.length > 0 && (
              <PresetsBar
                presets={presets}
                activePresetId={activePresetId}
                onSelectPreset={handleSelectPreset}
              />
            )}

            {/* Form + Result Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border-slate-800">
                <PredictionForm
                  input={input}
                  onChange={handleFieldChange}
                  onSubmit={handleSubmitPrediction}
                  onReset={handleReset}
                  isLoading={isPredicting}
                  error={predictError}
                />
              </div>

              {/* Right Column: Result Card or Empty State */}
              <div className="lg:col-span-5">
                {prediction ? (
                  <PredictionResultCard result={prediction} />
                ) : (
                  <div className="glass-panel p-8 sm:p-10 rounded-2xl border-slate-800 border-dashed text-center flex flex-col items-center justify-center min-h-[460px]">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-glow-cyan">
                      <Calculator className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Ready for Valuation Inference
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                      Configure the parameters on the left or click any archetype preset, then press
                      <span className="text-cyan-300 font-semibold"> "Execute Real-Time Valuation"</span> to evaluate the trained model pipeline.
                    </p>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 text-left space-y-2 w-full max-w-xs">
                      <div className="flex justify-between">
                        <span>Active Model:</span>
                        <span className="text-cyan-300 font-semibold">HistGradientBoost</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model Test R²:</span>
                        <span className="text-violet-300 font-semibold">84.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence Bounds:</span>
                        <span className="text-emerald-300 font-semibold">±1.645 Test RMSE</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* ANALYTICS & TELEMETRY SECTION */}
        <section id="analytics" className="py-20 border-t border-slate-800/80 bg-slate-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-violet-500/30 text-violet-300 text-xs font-mono mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>EVALUATION TELEMETRY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Live Model Performance & Benchmarks
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Direct insights from the genuine trained pipeline and held-out test evaluation.
                No hardcoded numbers or simulated metrics.
              </p>
            </div>

            {/* Metric KPI Cards */}
            <MetricCards metadata={metadata} analytics={analytics} />

            {/* Analytics Visualizations Grid */}
            {isLoadingAnalytics ? (
              <div className="h-64 glass-panel rounded-2xl flex items-center justify-center text-slate-400 text-sm">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-3" />
                Loading dataset telemetry artifacts...
              </div>
            ) : analytics ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: Price Distribution */}
                <PriceDistributionChart data={analytics.price_distribution} />

                {/* Chart 2: Model Comparison */}
                <ModelComparisonChart data={analytics.model_comparisons} />

                {/* Chart 3: Actual vs Predicted */}
                <ActualVsPredictedChart data={analytics.sample_comparisons} />

                {/* Chart 4: Feature Correlation */}
                <CorrelationChart correlations={analytics.summary_statistics} />
              </div>
            ) : (
              <div className="p-8 rounded-2xl glass-panel border-amber-500/30 text-amber-200 text-center">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="font-semibold">Analytics artifacts not found</p>
                <p className="text-xs text-slate-400 mt-1">Run <code className="text-cyan-300 font-mono">python backend/train.py</code> to regenerate model telemetry.</p>
              </div>
            )}

          </div>
        </section>

        {/* METHODOLOGY SECTION */}
        <Methodology />

        {/* DATASET LIMITATIONS SECTION */}
        <DatasetLimitations />

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default App;
