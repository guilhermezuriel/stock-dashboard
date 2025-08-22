import { useState, useEffect, useCallback } from 'react';
import { useTrading } from '../hooks/useTrading';
import { useApiConfig } from '../hooks/useApiConfig';
import ChartDashboard from './ChartDashboard';
import SearchBar from './SearchBar';
import type { Stock, Result } from '../types/stock';
import toast, { Toaster } from 'react-hot-toast';
import { formatNumber, formatVolume, storageInitialSymbols } from '../utils';

interface RealTimeTradingProps {
  initialSymbols: string[];
  watchlist: Stock[];
}

export default function RealTimeTrading({ initialSymbols }: RealTimeTradingProps) {
  const { apiKey, saveApiKey, removeApiKey, getWebSocketUrl } = useApiConfig();
  const { 
    tradeData, 
    tradeHistory, 
    subscribeToSymbol, 
    unsubscribeFromSymbol, 
    isConnected,
    connectionStatus,
    connect 
  } = useTrading(initialSymbols); // Passar símbolos iniciais para o hook

  const [symbols, setSymbols] = useState<string[]>(initialSymbols);
  const [subscribedSymbols, setSubscribedSymbols] = useState<Set<string>>(new Set(initialSymbols)); // Inicializar com símbolos iniciais
  const [selectedSymbolForChart, setSelectedSymbolForChart] = useState<string>('');
  const [newlyAddedSymbols, setNewlyAddedSymbols] = useState<Set<string>>(new Set());

  // Conectar WebSocket automaticamente quando API key estiver disponível
  useEffect(() => {
    if (apiKey && !isConnected && symbols.length > 0) {
      const websocketUrl = getWebSocketUrl();
      if (websocketUrl) {
        connect(websocketUrl).catch(error => {
          toast.error(`Failed to connect WebSocket: ${error.message}`);
        });
      } else {
        toast.error('Invalid WebSocket URL');
      }
    }
  }, [apiKey, isConnected, connect, getWebSocketUrl]); 

  // Inscrição inicial de símbolos após conexão (ESSENCIAL!)
  useEffect(() => {
    if (apiKey && isConnected && symbols.length > 0) {
      console.log('📡 Fazendo inscrição inicial de símbolos após conexão');
      
      const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));
      
      if (symbolsToSubscribe.length > 0) {
        console.log('📡 Símbolos para inscrição inicial:', symbolsToSubscribe);
        symbolsToSubscribe.forEach(symbol => {
          console.log('📡 Inscrevendo símbolo inicial:', symbol);
          subscribeToSymbol(symbol);
          setSubscribedSymbols(prev => new Set([...prev, symbol]));
        });
        
        storageInitialSymbols(symbols);
        toast.success(`${symbolsToSubscribe.length} símbolo(s) inscrito(s) com sucesso!`);
      }
    }
  }, [apiKey, isConnected]); // Removido symbols e subscribedSymbols para evitar execução desnecessária

  useEffect(() => {
    if (isConnected) {
      toast.success('WebSocket conectado com sucesso!');
    } else if (connectionStatus === 'CLOSED' && symbols.length > 0) {
      toast.error('WebSocket desconectado');
    }
  }, [isConnected, connectionStatus]);

  const handleAddSymbol = useCallback((symbol: string) => {
    console.log('🎯 handleAddSymbol chamado com:', symbol);
    console.log('🎯 symbols atuais:', symbols);
    console.log('🎯 isConnected:', isConnected);
    console.log('🎯 Símbolos já inscritos:', Array.from(subscribedSymbols));
    
    if (!symbols.includes(symbol)) {
      console.log('🎯 Adicionando novo símbolo:', symbol);
      setSymbols(prev => {
        const newSymbols = [...prev, symbol];
        storageInitialSymbols(newSymbols);
        return newSymbols;
      });
      
      if (isConnected) {
        console.log('🎯 Inscrevendo símbolo após adição:', symbol);
        subscribeToSymbol(symbol);
        setSubscribedSymbols(prev => new Set([...prev, symbol]));
        
        // Notificação de sucesso
        toast.success(`Símbolo ${symbol} adicionado com sucesso!`);
      } else {
        console.log('🎯 Não inscrevendo - WebSocket não conectado para:', symbol);
        toast.error(`Erro: WebSocket não conectado para adicionar ${symbol}`);
      }
    } else {
      console.log('🎯 Símbolo já existe:', symbol);
      toast.error(`Símbolo ${symbol} já existe na lista!`);
    }
  }, [symbols, isConnected, subscribeToSymbol, subscribedSymbols]);

  const handleRemoveSymbol = useCallback((symbol: string) => {
    setSymbols(prev => {
      const newSymbols = prev.filter(s => s !== symbol);
      // Salvar símbolos atualizados no localStorage
      storageInitialSymbols(newSymbols);
      return newSymbols;
    });
    
    if (isConnected) {
      unsubscribeFromSymbol(symbol);
      setSubscribedSymbols(prev => {
        const newSet = new Set(prev);
        newSet.delete(symbol);
        return newSet;
      });
      toast.success(`Símbolo ${symbol} removido com sucesso!`);
    } else {
      toast.error(`Erro: WebSocket não conectado para remover ${symbol}`);
    }
  }, [isConnected, unsubscribeFromSymbol, symbols, subscribedSymbols]);

  const handleSearch = async (query: string): Promise<Result[]> => {
    try {
      const response = await fetch(`https://finnhub.io/api/v1/search?q=${query}&exchange=US&token=${apiKey}`);
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        return data.result.slice(0, 10);
      }
      return [];
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Error searching symbols. Try again.');
      return [];
    }
  };

  const handleSelectStock = (result: Result) => {
    handleAddSymbol(result.symbol);
    setNewlyAddedSymbols(prev => new Set([...prev, result.symbol]));

    toast.success(`${result.symbol} added!`);
    
    setTimeout(() => {
      setNewlyAddedSymbols(prev => {
        const newSet = new Set(prev);
        newSet.delete(result.symbol);
        return newSet;
      });
    }, 5000);
  };

  

  if (!apiKey) {
    return (
      <div className="card p-6 bg-dark-800 border-dark-700">
        <h3 className="text-xl font-semibold text-white mb-4">API Configuration Required</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your Finnhub API key"
            value={apiKey || ''}
            onChange={(e) => saveApiKey(e.target.value)}
            className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (apiKey) {
                  saveApiKey(apiKey);
                  toast.success('API Key saved!');
                } else {
                  toast.error('Please enter a valid API Key');
                }
              }}
              className="btn btn-primary"
            >
              Save API Key
            </button>
            {apiKey && (
              <button
                onClick={() => {
                  removeApiKey();
                  toast.success('API Key removed!');
                }}
                className="btn btn-danger"
              >
                Remove API Key
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="card p-6 bg-dark-800 border-dark-700">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold text-white">Real-Time Trading</h3>
          <div className="flex gap-2">
            <SearchBar onSelect={handleSelectStock} onSearch={handleSearch} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-dark-700 text-gray-300">
              <tr>
                <th className="px-6 py-3">Symbol</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Volume</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isConnected && symbols.map(symbol => {
                console.log('🎯 symbol:', symbol);
                const data = tradeData.get(symbol);
                console.log('🎯 data:', data);
                const isNewlyAdded = newlyAddedSymbols.has(symbol);
                return (
                  <tr key={symbol} className={`border-b border-dark-600 hover:bg-dark-700 transition-all duration-300 ${
                    isNewlyAdded ? 'bg-success-900/20 border-l-4 border-l-success-400' : ''
                  }`}>
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {symbol}
                        {isNewlyAdded && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-400 text-success-900 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {data ? `$${formatNumber(data.p)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {data ? formatVolume(data.v) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {data ? new Date(data.t).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSymbolForChart(symbol)}
                          className="btn btn-sm btn-secondary"
                        >
                          Chart
                        </button>
                        <button
                          onClick={() => handleRemoveSymbol(symbol)}
                          className="btn btn-sm btn-danger"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success-400' : 'bg-danger-400'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      {selectedSymbolForChart && (
        <div className="card p-6 bg-dark-800 border-dark-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-white">
              Chart for {selectedSymbolForChart}
            </h4>
            <button
              onClick={() => {
                setSelectedSymbolForChart('');
                toast.success('Gráfico fechado');
              }}
              className="btn btn-sm btn-outline"
            >
              Close Chart
            </button>
          </div>
          <ChartDashboard 
            tradeData={tradeHistory.get(selectedSymbolForChart) || []}
            symbol={selectedSymbolForChart}
          />
        </div>
      )}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f9fafb',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f9fafb',
            },
          },
        }}
      />
    </div>
  );
}
