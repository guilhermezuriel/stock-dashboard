import type { TradeData, TradeResponse, CryptoStock } from '../types/stock';

export class TradingService {
  private static ws: WebSocket | null = null;
  private static subscribers: Map<string, (data: TradeData) => void> = new Map();
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;
  private static initialSymbols: string[] = []; // Símbolos iniciais para inscrição automática

  static connectWebSocket(url: string, symbols: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
     
        
        this.initialSymbols = [...symbols];
        
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
         
          this.reconnectAttempts = 0;
          
          this.subscribeToInitialSymbols();
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: TradeResponse = JSON.parse(event.data);
            this.handleTradeData(data);
          } catch (error) {
            console.error('Error while fetching data:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Websocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.handleReconnection(url);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Inscrição automática dos símbolos iniciais após conexão
  private static subscribeToInitialSymbols(): void {
    if (this.initialSymbols.length > 0) {
      console.log('📡 Fazendo inscrição automática dos símbolos iniciais:', this.initialSymbols);
      
      this.initialSymbols.forEach(symbol => {
        console.log('📡 Inscrição automática para:', symbol);
        this.subscribeSymbol(symbol);
      });
      
      // Limpar símbolos iniciais após inscrição
      this.initialSymbols = [];
    } else {
      console.log('📡 Nenhum símbolo inicial para inscrição automática');
    }
  }

  private static handleReconnection(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Tentativa de reconexão ${this.reconnectAttempts} em ${delay}ms`);
      
      setTimeout(() => {
        this.connectWebSocket(url).catch(console.error);
      }, delay);
    } else {
      console.error('Máximo de tentativas de reconexão atingido');
    }
  }

  
  private static handleTradeData(tradeResponse: TradeResponse) {
    if (tradeResponse.type === 'trade' && tradeResponse.data) {
      tradeResponse.data.forEach(trade => {
        const symbol = this.extractSymbol(trade.s);
        if (symbol && this.subscribers.has(symbol)) {
          this.subscribers.get(symbol)!(trade);
        }
      });
    }
  }

 
  private static extractSymbol(fullSymbol: string): string {
    const parts = fullSymbol.split(':');
    return parts.length > 1 ? parts[1] : fullSymbol;
  }

 
  static subscribeToSymbol(symbol: string, callback: (data: TradeData) => void): () => void {
    this.subscribers.set(symbol, callback);
    

    return () => {
      this.subscribers.delete(symbol);
    };
  }

  static sendMessage(message: any): void {
    console.log("SENDING MESSAGE", message)
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket não está conectado');
    }
  }

  
  static subscribeSymbol(symbol: string): void {
    console.log("📡 SUBSCRIBING TO SYMBOL", symbol);
    
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket não está conectado para inscrever símbolo:', symbol);
      return;
    }
    
    const message = {
      type: 'subscribe',
      symbol: symbol
    };
    this.sendMessage(message);
  }

  
  static unsubscribeSymbol(symbol: string): void {
    console.log("📡 UNSUBSCRIBING FROM SYMBOL", symbol);
    
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket não está conectado para desinscrever símbolo:', symbol);
      return;
    }
    
    const message = {
      type: 'unsubscribe',
      symbol: symbol
    };
    this.sendMessage(message);
  }


  static disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }


  static getMockTradeData(symbol: string): TradeData {
    const basePrice = 50000 + Math.random() * 10000;
    const change = (Math.random() - 0.5) * 1000;
    
    return {
      p: basePrice + change,
      s: `BINANCE:${symbol}`,
      t: Date.now(),
      v: Math.random() * 10
    };
  }


  static tradeDataToCryptoStock(trade: TradeData, previousPrice?: number): CryptoStock {
    const symbol = this.extractSymbol(trade.s);
    const change = previousPrice ? trade.p - previousPrice : 0;
    const changePercent = previousPrice ? (change / previousPrice) * 100 : 0;

    return {
      symbol,
      name: symbol,
      currentPrice: trade.p,
      change,
      changePercent,
      volume: trade.v,
      exchange: 'BINANCE',
      lastUpdate: new Date(trade.t),
      priceUSD: trade.p
    };
  }

  static getConnectionStatus(): 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' {
    if (!this.ws) return 'CLOSED';
    return this.ws.readyState === 0 ? 'CONNECTING' :
           this.ws.readyState === 1 ? 'OPEN' :
           this.ws.readyState === 2 ? 'CLOSING' : 'CLOSED';
  }
}
