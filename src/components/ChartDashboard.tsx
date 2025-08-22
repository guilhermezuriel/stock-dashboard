import React, { useState, useEffect } from 'react';
import AdvancedStockChart from './AdvancedStockChart';
import type { TradeData } from '../types/stock';

interface ChartDashboardProps {
  symbol: string;
  tradeData: TradeData[];
}

const ChartDashboard: React.FC<ChartDashboardProps> = ({ symbol, tradeData }) => {
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'area' | 'candlestick' | 'volume'>('line');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '4h' | '1d' | '1w'>('1d');
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const getFilteredData = () => {
    if (!tradeData || tradeData.length === 0) return [];

    const now = Date.now();
    let timeFilter: number;

    switch (selectedTimeRange) {
      case '1h':
        timeFilter = now - (60 * 60 * 1000);
        break;
      case '4h':
        timeFilter = now - (4 * 60 * 60 * 1000);
        break;
      case '1d':
        timeFilter = now - (24 * 60 * 60 * 1000);
        break;
      case '1w':
        timeFilter = now - (7 * 24 * 60 * 60 * 1000);
        break;
      default:
        timeFilter = now - (24 * 60 * 60 * 1000);
    }

    return tradeData.filter(trade => trade.t >= timeFilter);
  };

  const filteredData = getFilteredData();

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing chart data...');
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Chart Dashboard - {symbol}</h2>
            <p className="text-gray-400">Advanced real-time visualizations</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Chart Type</label>
              <select 
                value={selectedChartType}
                onChange={(e) => setSelectedChartType(e.target.value as any)}
                className="bg-dark-600 border border-dark-500 text-white rounded px-3 py-2 text-sm focus:border-navy-400 focus:ring-navy-400"
              >
                <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="candlestick">Candlestick</option>
                <option value="volume">Volume</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Time Range</label>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                className="bg-dark-600 border border-dark-500 text-white rounded px-3 py-2 text-sm focus:border-navy-400 focus:ring-navy-400"
              >
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Auto-refresh</label>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-success-600 text-white hover:bg-success-700' 
                    : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
                }`}
              >
                {autoRefresh ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
            <p className="text-gray-400 text-sm">Data Points</p>
            <p className="text-white font-bold text-lg">{filteredData.length}</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
            <p className="text-gray-400 text-sm">Last Update</p>
            <p className="text-white font-bold text-lg">
              {filteredData.length > 0 ? new Date(filteredData[filteredData.length - 1].t).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
            <p className="text-gray-400 text-sm">Current Price</p>
            <p className="text-white font-bold text-lg">
              ${filteredData.length > 0 ? filteredData[filteredData.length - 1].p.toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-success-400 font-bold text-lg">
              {autoRefresh ? 'Active' : 'Paused'}
            </p>
          </div>
        </div>
      </div>

      <AdvancedStockChart
        symbol={symbol}
        data={filteredData}
        chartType={selectedChartType}
        showVolume={showVolume}
        showMA={showMA}
      />

      <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4">Advanced Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-300 mb-3">Visualization</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input 
                  type="checkbox" 
                  checked={showVolume} 
                  onChange={(e) => setShowVolume(e.target.checked)}
                  className="rounded border-dark-500 bg-dark-600 text-navy-400 focus:ring-navy-400"
                />
                Show Volume
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input 
                  type="checkbox" 
                  checked={showMA} 
                  onChange={(e) => setShowMA(e.target.checked)}
                  className="rounded border-dark-500 bg-dark-600 text-navy-400 focus:ring-navy-400"
                />
                Moving Averages (MA5, MA20)
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-300 mb-3">Information</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Symbol: <span className="text-white">{symbol}</span></p>
              <p>Data: <span className="text-white">{filteredData.length} points</span></p>
              <p>Range: <span className="text-white">{selectedTimeRange}</span></p>
              <p>Type: <span className="text-white">{selectedChartType}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDashboard;
