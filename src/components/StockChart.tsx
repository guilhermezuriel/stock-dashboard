import React from 'react';

interface StockChartProps {
  symbol: string;
  data: Array<{
    date: string;
    price: number;
    volume: number;
  }>;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, data }) => {
  return (
    <div className="bg-gradient-to-br from-dark-700 to-navy-800 rounded-lg p-4 border-l-4 border-navy-500">
      <h3 className="text-lg font-semibold text-white mb-4">Chart for {symbol}</h3>
      <div className="min-h-[300px]">
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4">Price chart for {symbol}</p>
          <div className="max-h-48 overflow-y-auto">
            {data.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b border-dark-600 last:border-b-0 text-sm">
                <span className="text-gray-400">{item.date}</span>
                <span className="font-medium text-white">$ {item.price.toFixed(2)}</span>
                <span className="text-gray-500">{item.volume.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
