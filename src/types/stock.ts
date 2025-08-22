export interface FinnhubResponse<T> {
  count: number;
  data: T;
}

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
}

export interface StockData {
  date: string;
  price: number;
  volume: number;
  open: number;
  high: number;
  low: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface SearchResult {
  count: number;
  result: Result[];
}

export interface Result {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export interface WatchlistItem extends Stock {
  addedAt: Date;
}

// Novos tipos para dados de trading em tempo real
export interface TradeData {
  p: number;        // Preço
  s: string;        // Symbol (ex: "BINANCE:BTCUSDT")
  t: number;        // Timestamp
  v: number;        // Volume
}

export interface TradeResponse {
  data: TradeData[];
  type: string;
}

export interface CryptoStock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  exchange: string;
  lastUpdate: Date;
  priceUSD?: number;
  marketCap?: number;
  circulatingSupply?: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  exchange: string;
}
