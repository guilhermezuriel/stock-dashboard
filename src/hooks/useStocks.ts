import { useState, useEffect } from 'react';
import stockService from '../services/stockService';
import type { Stock, Result } from '../types/stock';

export const useStocks = () => {
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize with empty state since we don't have getPopularStocks anymore
    setLoading(false);
  }, []);

  const addToWatchlist = (stock: Stock) => {
    if (!watchlist.find(s => s.symbol === stock.symbol)) {
      setWatchlist(prev => [...prev, stock]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s.symbol !== symbol));
  };

  const searchStocks = async (query: string): Promise<Result[]> => {
    try {
      return await stockService.searchStocks(query);
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    }
  };

  return {
    watchlist,
    loading,
    searchStocks,
    addToWatchlist,
    removeFromWatchlist
  };
};
