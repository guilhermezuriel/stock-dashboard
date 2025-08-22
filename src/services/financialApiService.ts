import axiosService from '../config/axios';
import type { SearchResult, FinnhubResponse, Result } from '../types/stock';

export interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface FinnhubCompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

class FinancialApiService {

  async searchStocks(query: string): Promise<Result[]> {
    try {
      const response = await axiosService.get<FinnhubResponse<SearchResult>>(`/search`, {
        params: { q: query, exchange: 'US' }
      });
      return response.data.result || [];
    } catch (error) {
      console.error(`Failed to search stocks for "${query}":`, error);
      return [];
    }
  }


  async getSocialSentiment(symbol: string): Promise<any> {
    try {
      const response = await axiosService.get(`/stock/social-sentiment`, {
        params: { symbol: symbol.toUpperCase() }
      });
      return response;
    } catch (error) {
      console.error(`Failed to fetch social sentiment for ${symbol}:`, error);
      return null;
    }
  }

  async getPeers(symbol: string): Promise<string[]> {
    try {
      const response = await axiosService.get(`/stock/peers`, {
        params: { symbol: symbol.toUpperCase() }
      });
      return response || [];
    } catch (error) {
      console.error(`Failed to fetch peers for ${symbol}:`, error);
      return [];
    }
  }

  async getEarnings(symbol: string): Promise<any> {
    try {
      const response = await axiosService.get(`/stock/earnings`, {
        params: { symbol: symbol.toUpperCase() }
      });
      return response;
    } catch (error) {
      console.error(`Failed to fetch earnings for ${symbol}:`, error);
      return null;
    }
  }

  async getFinancials(symbol: string, statement: string = 'income'): Promise<any> {
    try {
      const response = await axiosService.get(`/stock/financials`, {
        params: {
          symbol: symbol.toUpperCase(),
          statement
        }
      });
      return response;
    } catch (error) {
      console.error(`Failed to fetch financials for ${symbol}:`, error);
      return null;
    }
  }

  async getSymbols(exchange: string = 'US'): Promise<string[]> {
    try {
      const response = await axiosService.get(`/stock/symbol`, {
        params: { exchange: exchange.toUpperCase() }
      });
      return response.map((item: any) => item.symbol);
    } catch (error) {
      console.error(`Failed to fetch symbols for exchange ${exchange}:`, error);
      return [];
    }
  }

  async getExchangeSymbols(): Promise<any[]> {
    try {
      const response = await axiosService.get(`/stock/symbol`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch exchange symbols:`, error);
      return [];
    }
  }

  async getMarketStatus(): Promise<any> {
    try {
      const response = await axiosService.get(`/stock/market-status`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch market status:`, error);
      return null;
    }
  }

  async getCryptoExchanges(): Promise<any[]> {
    try {
      const response = await axiosService.get(`/crypto/exchange`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch crypto exchanges:`, error);
      return [];
    }
  }

  async getCryptoSymbols(exchange: string): Promise<any[]> {
    try {
      const response = await axiosService.get(`/crypto/symbol`, {
        params: { exchange }
      });
      return response;
    } catch (error) {
      console.error(`Failed to fetch crypto symbols for ${exchange}:`, error);
      return [];
    }
  }

  async getForexExchanges(): Promise<any[]> {
    try {
      const response = await axiosService.get(`/forex/exchange`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch forex exchanges:`, error);
      return [];
    }
  }

  async getForexSymbols(exchange: string): Promise<any[]> {
    try {
      const response = await axiosService.get(`/forex/exchange`, {
        params: { exchange }
      });
      return response;
    } catch (error) {
      console.error(`Failed to fetch forex symbols for ${exchange}:`, error);
      return [];
    }
  }
}

export const financialApiService = new FinancialApiService();
export default financialApiService;
