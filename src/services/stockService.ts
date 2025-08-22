import financialApiService from './financialApiService';
import type { Result } from '../types/stock';

class StockService {

  async searchStocks(query: string): Promise<Result[]> {
    try {
      const results = await financialApiService.searchStocks(query);
      return results.slice(0, 10);
    } catch (error) {
      console.error(`Falha ao buscar ações para "${query}":`, error);
      return [];
    }
  }
}   

export const stockService = new StockService();
export default stockService;
