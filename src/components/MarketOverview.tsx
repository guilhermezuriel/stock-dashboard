import React from 'react';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface MarketOverviewProps {
  indices: MarketIndex[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ indices }) => {
  return (
    <div className="card p-6 bg-dark-800 border-dark-700">
      <h3 className="text-xl font-semibold text-white mb-4">Visão Geral do Mercado</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {indices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div key={index.name} className="bg-gradient-to-br from-dark-700 to-navy-800 rounded-lg p-4 border-l-4 border-navy-500 hover:shadow-lg transition-shadow duration-200">
              <div className="text-sm font-medium text-gray-300 mb-2">{index.name}</div>
              <div className="text-2xl font-bold text-white mb-2">{index.value.toFixed(2)}</div>
              <div className={`flex gap-2 text-sm ${isPositive ? 'text-success-400' : 'text-danger-400'}`}>
                <span className="font-medium">
                  {isPositive ? '+' : ''}{index.change.toFixed(2)}
                </span>
                <span>
                  ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketOverview;
