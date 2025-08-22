import React from 'react';

interface StockCardProps {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  description,
  displaySymbol,
  type
}) => {
  return (
    <div className="bg-gradient-to-br from-dark-700 to-navy-800 rounded-lg p-4 border-l-4 border-navy-500 hover:shadow-lg transition-shadow duration-200">
      <div className="mb-3">
        <h4 className="text-lg font-bold text-white mb-1">{displaySymbol || symbol}</h4>
        <span className="text-sm text-gray-300">{description}</span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Symbol:</span>
          <span className="font-medium text-white">{symbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Type:</span>
          <span className="font-medium text-white">{type}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
