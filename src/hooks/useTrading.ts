import { useState, useEffect, useCallback, useRef } from 'react';
import { TradingService } from '../services/tradingService';
import type { TradeData, CryptoStock } from '../types/stock';

export const useTrading = (initialSymbols: string[] = []) => {
  const [tradeData, setTradeData] = useState<Map<string, TradeData>>(new Map());
  const [tradeHistory, setTradeHistory] = useState<Map<string, TradeData[]>>(new Map());
  const [cryptoStocks, setCryptoStocks] = useState<Map<string, CryptoStock>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED'>('CLOSED');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const previousPrices = useRef<Map<string, number>>(new Map());
  const unsubscribeFunctions = useRef<Map<string, () => void>>(new Map());

  // Conectar ao WebSocket
  const connect = useCallback(async (url: string) => {
    try {
      setError(null);
      setConnectionStatus('CONNECTING');
  
      await TradingService.connectWebSocket(url, initialSymbols);
      
      setConnectionStatus('OPEN');
      setIsConnected(true);
  
      if (initialSymbols.length > 0) {
        initialSymbols.forEach(symbol => {
          setupSymbolCallback(symbol);
        });
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar');
      setConnectionStatus('CLOSED');
      setIsConnected(false);
    }
  }, [initialSymbols]);

  const setupSymbolCallback = useCallback((symbol: string) => {

    if (unsubscribeFunctions.current.has(symbol)) {
      unsubscribeFunctions.current.get(symbol)?.();
    }

    const unsubscribe = TradingService.subscribeToSymbol(symbol, (data: TradeData) => {
      setTradeData(prev => new Map(prev.set(symbol, data)));
      
      setTradeHistory(prev => {
        const newMap = new Map(prev);
        const currentHistory = newMap.get(symbol) || [];
        const newHistory = [...currentHistory, data];
        
        if (newHistory.length > 1000) {
          newHistory.splice(0, newHistory.length - 1000);
        }
        
        newMap.set(symbol, newHistory);
        return newMap;
      });
      
      const previousPrice = previousPrices.current.get(symbol);
      const cryptoStock = TradingService.tradeDataToCryptoStock(data, previousPrice);
      
      setCryptoStocks(prev => new Map(prev.set(symbol, cryptoStock)));
      
      previousPrices.current.set(symbol, data.p);
    });

    unsubscribeFunctions.current.set(symbol, unsubscribe);
  }, []);


  const disconnect = useCallback(() => {
    TradingService.disconnect();
    setConnectionStatus('CLOSED');
    setIsConnected(false);
    setTradeData(new Map());
    setTradeHistory(new Map());
    setCryptoStocks(new Map());
  }, []);


  const subscribeToSymbol = useCallback((symbol: string) => {
    
    if (unsubscribeFunctions.current.has(symbol)) {
      unsubscribeFunctions.current.get(symbol)?.();
    }
    const unsubscribe = TradingService.subscribeToSymbol(symbol, (data: TradeData) => {
      setTradeData(prev => new Map(prev.set(symbol, data)));
      
      setTradeHistory(prev => {
        const newMap = new Map(prev);
        const currentHistory = newMap.get(symbol) || [];
        const newHistory = [...currentHistory, data];
        
        if (newHistory.length > 1000) {
          newHistory.splice(0, newHistory.length - 1000);
        }
        
        newMap.set(symbol, newHistory);
        return newMap;
      });
      
      const previousPrice = previousPrices.current.get(symbol);
      const cryptoStock = TradingService.tradeDataToCryptoStock(data, previousPrice);
      
      setCryptoStocks(prev => new Map(prev.set(symbol, cryptoStock)));
      
      previousPrices.current.set(symbol, data.p);
    });

    unsubscribeFunctions.current.set(symbol, unsubscribe);
 
    if (isConnected && !initialSymbols.includes(symbol)) {
      TradingService.subscribeSymbol(symbol);
    } else if (isConnected && initialSymbols.includes(symbol)) {
      console.log('🔔 TradingService already subscribed to:', symbol);
    } else {
      console.log('⚠️ WebSocket not connected to:', symbol);
    }
  }, [isConnected, connectionStatus, initialSymbols]);


  const unsubscribeFromSymbol = useCallback((symbol: string) => {
    if (unsubscribeFunctions.current.has(symbol)) {
      unsubscribeFunctions.current.get(symbol)?.();
      unsubscribeFunctions.current.delete(symbol);
    }

    if (isConnected) {

      TradingService.unsubscribeSymbol(symbol);
    } else {
      console.log('⚠️ Não desinscrevendo do WebSocket - não conectado para:', symbol);
    }
    
    setTradeData(prev => {
      const newMap = new Map(prev);
      newMap.delete(symbol);
      return newMap;
    });
    
    setTradeHistory(prev => {
      const newMap = new Map(prev);
      newMap.delete(symbol);
      return newMap;
    });
    
    setCryptoStocks(prev => {
      const newMap = new Map(prev);
      newMap.delete(symbol);
      return newMap;
    });
  }, [isConnected, connectionStatus]);

  const addSymbol = useCallback((symbol: string) => {
    if (isConnected) {
      subscribeToSymbol(symbol);
    } else {
      console.log('⚠️ WebSocket not connected to:', symbol);
    }
  }, [isConnected, subscribeToSymbol]);


  const removeSymbol = useCallback((symbol: string) => {
    if (isConnected) {
      unsubscribeFromSymbol(symbol);
    } else {
      console.log('⚠️ WebSocket not connected to:', symbol);
    }
  }, [isConnected, unsubscribeFromSymbol]);

 
  const getSymbolData = useCallback((symbol: string): TradeData | undefined => {
    return tradeData.get(symbol);
  }, [tradeData]);

 
  const getSymbolHistory = useCallback((symbol: string): TradeData[] => {
    return tradeHistory.get(symbol) || [];
  }, [tradeHistory]);

 
  const getCryptoStock = useCallback((symbol: string): CryptoStock | undefined => {
    return cryptoStocks.get(symbol);
  }, [cryptoStocks]);


  useEffect(() => {
    console.log('🔍 Iniciando monitoramento de status da conexão');
    
    const interval = setInterval(() => {
      const status = TradingService.getConnectionStatus();
      const wasConnected = isConnected;
      const newIsConnected = status === 'OPEN';
      
      console.log('🔍 Status da conexão:', status, 'isConnected:', isConnected, 'novo:', newIsConnected);
      
      if (status !== connectionStatus) {
        console.log('🔍 Atualizando status da conexão:', connectionStatus, '->', status);
        setConnectionStatus(status);
      }
      
      if (wasConnected !== newIsConnected) {
        console.log('🔍 Atualizando isConnected:', wasConnected, '->', newIsConnected);
        setIsConnected(newIsConnected);
      }
    }, 1000);

    return () => {
      console.log('🔍 Parando monitoramento de status da conexão');
      clearInterval(interval);
    };
  }, [isConnected, connectionStatus]);

 
  useEffect(() => {
    return () => {
      unsubscribeFunctions.current.forEach(unsubscribe => unsubscribe());
      TradingService.disconnect();
    };
  }, []);

  return {
    // States
    tradeData,
    tradeHistory,
    cryptoStocks,
    connectionStatus,
    isConnected,
    error,
    
    // Actions
    connect,
    disconnect,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    addSymbol,
    removeSymbol,
    
    // Getters
    getSymbolData,
    getSymbolHistory,
    getCryptoStock,
    
    // Utils
  };
};
