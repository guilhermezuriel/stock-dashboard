// Configuração de variáveis de ambiente
export const env = {
  FINNHUB_API_KEY: import.meta.env.VITE_FINNHUB_API_KEY || '',
  FINNHUB_WS_URL: import.meta.env.VITE_FINNHUB_WS_URL || 'wss://ws.finnhub.io?token=',
  
  ALPHA_VANTAGE_API_KEY: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  POLYGON_API_KEY: import.meta.env.VITE_POLYGON_API_KEY || '',
  
  DEFAULT_SYMBOLS: import.meta.env.VITE_DEFAULT_SYMBOLS || 'AAPL,MSFT,GOOGL,BINANCE:BTCUSDT',
  CHART_UPDATE_INTERVAL: parseInt(import.meta.env.VITE_CHART_UPDATE_INTERVAL || '5000'),
  MAX_DATA_POINTS: parseInt(import.meta.env.VITE_MAX_DATA_POINTS || '1000'),
  
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV || false,
  IS_PROD: import.meta.env.PROD || false
};

export const isValidApiKey = (apiKey: string): boolean => {
  return Boolean(apiKey && apiKey.length > 10 && apiKey !== 'your_api_key_here');
};

export default env;
