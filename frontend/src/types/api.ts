/**
 * NEXUS ESTATE - TypeScript API Interfaces
 */

export interface PredictionInput {
  MedInc: number;
  HouseAge: number;
  AveRooms: number;
  AveBedrms: number;
  Population: number;
  AveOccup: number;
  Latitude: number;
  Longitude: number;
}

export interface ConfidenceInterval {
  lower_bound_usd: number;
  upper_bound_usd: number;
  confidence_level: string;
}

export interface PredictionResult {
  status: string;
  predicted_raw: number;
  predicted_value_usd: number;
  predicted_value_formatted: string;
  currency: string;
  model_name: string;
  target_scale_explanation: string;
  input_summary: Record<string, number>;
  derived_features: {
    BedroomsPerRoom: number;
    PeoplePerRoom: number;
    DistToLA_deg: number;
    DistToSF_deg: number;
  };
  confidence_interval: ConfidenceInterval;
  test_metrics?: {
    mae: number;
    rmse: number;
    r2: number;
    mae_usd: number;
    rmse_usd: number;
  };
  disclaimer: string;
}

export interface PropertyPreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  values: PredictionInput;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  model_name: string | null;
  version: string;
  environment: string;
  dataset_records: number | null;
}

export interface ModelCandidate {
  name: string;
  type: string;
  r2_cv_mean: number;
  rmse_cv_mean: number;
  mae_cv_mean: number;
  rmse_cv_usd: number;
  mae_cv_usd: number;
  test_r2?: number;
  test_rmse?: number;
  test_mae?: number;
  is_selected_champion?: boolean;
}

export interface PriceDistributionBin {
  range: string;
  count: number;
  min_val: number;
  max_val: number;
}

export interface SampleComparison {
  id: number;
  actual: number;
  predicted: number;
  residual: number;
  abs_error: number;
}

export interface ResidualDistributionBin {
  range: string;
  count: number;
  bin_center: number;
}

export interface AnalyticsData {
  total_records: number;
  total_features: number;
  summary_statistics: Record<string, {
    mean: number;
    std: number;
    min: number;
    p25: number;
    median: number;
    p75: number;
    max: number;
    corr_with_target: number;
  }>;
  price_distribution: PriceDistributionBin[];
  correlation_matrix: Record<string, Record<string, number>>;
  sample_comparisons: SampleComparison[];
  residual_distribution: ResidualDistributionBin[];
  model_comparisons: ModelCandidate[];
  test_metrics: {
    mae: number;
    rmse: number;
    r2: number;
    mae_usd: number;
    rmse_usd: number;
  };
}

export interface ModelMetadata {
  model_name: string;
  architecture_type: string;
  training_timestamp: string;
  random_seed: number;
  dataset_name: string;
  source: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  target_variable: string;
  target_description: string;
  target_multiplier: number;
  target_unit: string;
  features: Record<string, {
    name: string;
    description: string;
    unit: string;
    min: number;
    max: number;
    default: number;
    step: number;
  }>;
  limitations: string;
  cv_performance: {
    r2_cv_mean: number;
    rmse_cv_mean: number;
    mae_cv_mean: number;
  };
  test_performance: {
    mae: number;
    rmse: number;
    r2: number;
    mae_usd: number;
    rmse_usd: number;
  };
  all_candidates_benchmarked: ModelCandidate[];
}
