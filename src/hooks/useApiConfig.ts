import { useState, useEffect, useCallback } from 'react';
import { env } from '../config/env';

interface ApiConfig {
  apiKey: string;
  websocketUrl: string;
  defaultSymbols: string[];
  chartUpdateInterval: number;
  maxDataPoints: number;
}

export const useApiConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('finnhub_api_key');
    if (storedKey && storedKey.length > 10 && storedKey !== 'your_api_key_here') {
      setApiKey(storedKey);
      setIsConfigured(true);
    }
  }, []);

  const saveApiKey = useCallback((key: string): boolean => {
    if (!key || key.length <= 10 || key === 'your_api_key_here') {
      setError('Invalid API key. Please provide a valid Finnhub API key.');
      return false;
    }

    try {
      localStorage.setItem('finnhub_api_key', key);
      setApiKey(key);
      setIsConfigured(true);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to save API key to localStorage.');
      return false;
    }
  }, []);

  const removeApiKey = useCallback(() => {
    try {
      localStorage.removeItem('finnhub_api_key');
      setApiKey('');
      setIsConfigured(false);
      setError(null);
    } catch (err) {
      setError('Failed to remove API key from localStorage.');
    }
  }, []);

  const getWebSocketUrlLocal = useCallback((): string => {
    if (!apiKey || apiKey.length <= 10 || apiKey === 'your_api_key_here') {
      return '';
    }
    return `wss://ws.finnhub.io?token=${apiKey}`;
  }, [apiKey]);

  const getApiHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (apiKey && apiKey.length > 10 && apiKey !== 'your_api_key_here') {
      headers['X-Finnhub-Token'] = apiKey;
    }
    
    return headers;
  }, [apiKey]);

  const getDefaultSymbols = useCallback((): string[] => {
    return env.DEFAULT_SYMBOLS.split(',').map((s: string) => s.trim());
  }, []);

  const getChartUpdateInterval = useCallback((): number => {
    return env.CHART_UPDATE_INTERVAL;
  }, []);

  const getMaxDataPoints = useCallback((): number => {
    return env.MAX_DATA_POINTS;
  }, []);

  const isValidApiKey = useCallback((key: string): boolean => {
    return Boolean(key && key.length > 10 && key !== 'your_api_key_here');
  }, []);

  const getConfig = useCallback((): ApiConfig => {
    return {
      apiKey,
      websocketUrl: getWebSocketUrlLocal(),
      defaultSymbols: getDefaultSymbols(),
      chartUpdateInterval: getChartUpdateInterval(),
      maxDataPoints: getMaxDataPoints()
    };
  }, [apiKey, getWebSocketUrlLocal, getDefaultSymbols, getChartUpdateInterval, getMaxDataPoints]);

  return {
    isConfigured,
    apiKey,
    error,
    saveApiKey,
    removeApiKey,
    getWebSocketUrl: getWebSocketUrlLocal,
    getApiHeaders,
    getDefaultSymbols,
    getChartUpdateInterval,
    getMaxDataPoints,
    isValidApiKey,
    getConfig
  };
};
