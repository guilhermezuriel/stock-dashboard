import React from 'react';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface WatchlistProps {
  stocks: Stock[];
  onRemoveStock: (symbol: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ stocks, onRemoveStock }) => {
  if (stocks.length === 0) {
    return (
      <div className="card p-6 text-center bg-dark-800 border-dark-700">
        <h3 className="text-xl font-semibold text-white mb-2">Watchlist</h3>
        <p className="text-gray-400">No stocks added to watchlist.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 bg-dark-800 border-dark-700">
      <h3 className="text-xl font-semibold text-white mb-4">Watchlist ({stocks.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="relative">
            <div className="bg-gradient-to-br from-dark-700 to-navy-800 rounded-lg p-4 border-l-4 border-navy-500">
              <div className="mb-3">
                <h4 className="text-lg font-bold text-white mb-1">{stock.symbol}</h4>
                <span className="text-sm text-gray-300">{stock.name}</span>
              </div>
              
              <div className="mb-3">
                <div className="text-2xl font-bold text-white mb-1">
                  $ {stock.currentPrice.toFixed(2)}
                </div>
                <div className={`flex gap-2 text-sm ${stock.change >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                  <span className="font-medium">
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </span>
                  <span>
                    ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Volume: {stock.volume.toLocaleString()}
              </div>
            </div>
            <button
              className="absolute top-2 right-2 bg-danger-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-danger-600 transition-colors duration-200"
              onClick={() => onRemoveStock(stock.symbol)}
              title="Remove from watchlist"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
