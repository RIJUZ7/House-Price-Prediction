import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AnalyticsData, ModelMetadata } from '../types/api';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [analyticsData, metadataData] = await Promise.all([
        api.getAnalytics(),
        api.getMetadata(),
      ]);
      setAnalytics(analyticsData);
      setMetadata(metadataData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load telemetry artifacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { analytics, metadata, isLoading, error, refetch: fetchData };
}
