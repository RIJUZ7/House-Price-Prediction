/**
 * NEXUS ESTATE - API Client Service
 * Connects to the FastAPI backend with structured error handling and typing.
 */

import type {
  HealthStatus,
  ModelMetadata,
  AnalyticsData,
  PropertyPreset,
  PredictionInput,
  PredictionResult,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      let errorMsg = `Server error (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        errorMsg = await res.text() || errorMsg;
      }
      throw new ApiError(errorMsg, res.status);
    }

    return await res.json() as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failure / server offline
    throw new ApiError(
      `Failed to connect to backend server at ${API_BASE_URL}. Ensure FastAPI is running on port 8000. (${error.message || error})`,
      0
    );
  }
}

export const api = {
  getHealth: () => request<HealthStatus>('/api/health'),
  getMetadata: () => request<ModelMetadata>('/api/metadata'),
  getAnalytics: () => request<AnalyticsData>('/api/analytics'),
  getPresets: () => request<PropertyPreset[]>('/api/presets'),
  predict: (input: PredictionInput) =>
    request<PredictionResult>('/api/predict', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  getBaseUrl: () => API_BASE_URL,
};
