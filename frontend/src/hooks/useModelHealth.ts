import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { HealthStatus } from '../types/api';

export function useModelHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setIsLoading(true);
      const data = await api.getHealth();
      setHealth(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Backend connection failed');
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { health, isLoading, error, refetch: checkHealth };
}
