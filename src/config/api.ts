import { env } from './env';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  params?: Record<string, any>;
}

export const apiConfigs = {
  finnhub: {
    baseURL: 'https://finnhub.io/api/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    params: {
      token: env.FINNHUB_API_KEY
    }
  },
  
  alphaVantage: {
    baseURL: 'https://www.alphavantage.co/query',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    params: {
      apikey: env.ALPHA_VANTAGE_API_KEY
    }
  },
  
  yahooFinance: {
    baseURL: 'https://query1.finance.yahoo.com/v8/finance',
    timeout: 12000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; StockDashboard/1.0)'
    }
  },
  
  polygon: {
    baseURL: 'https://api.polygon.io/v2',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    params: {
      apiKey: env.POLYGON_API_KEY
    }
  }
};

export const getApiConfig = (provider: keyof typeof apiConfigs): ApiConfig => {
  return apiConfigs[provider];
};

export const createApiUrl = (provider: keyof typeof apiConfigs, endpoint: string): string => {
  const config = getApiConfig(provider);
  return `${config.baseURL}${endpoint}`;
};

export const getApiHeaders = (provider: keyof typeof apiConfigs): Record<string, string> => {
  const config = getApiConfig(provider);
  return config.headers;
};

export const getApiParams = (provider: keyof typeof apiConfigs): Record<string, any> => {
  const config = getApiConfig(provider);
  return config.params || {};
};

export const isApiConfigured = (provider: keyof typeof apiConfigs): boolean => {
  switch (provider) {
    case 'finnhub':
      return Boolean(env.FINNHUB_API_KEY && env.FINNHUB_API_KEY.length > 10 && env.FINNHUB_API_KEY !== 'your_api_key_here');
    case 'alphaVantage':
      return Boolean(env.ALPHA_VANTAGE_API_KEY && env.ALPHA_VANTAGE_API_KEY.length > 10 && env.ALPHA_VANTAGE_API_KEY !== 'your_api_key_here');
    case 'polygon':
      return Boolean(env.POLYGON_API_KEY && env.POLYGON_API_KEY.length > 10 && env.POLYGON_API_KEY !== 'your_api_key_here');
    case 'yahooFinance':
      return true;
    default:
      return false;
  }
};

export const getAvailableApis = (): Array<{ name: string; configured: boolean; baseURL: string }> => {
  return Object.entries(apiConfigs).map(([name, config]) => ({
    name,
    configured: isApiConfigured(name as keyof typeof apiConfigs),
    baseURL: config.baseURL
  }));
};

export default apiConfigs;
