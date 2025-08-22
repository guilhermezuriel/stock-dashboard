import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TradeData } from '../types/stock';

interface AdvancedStockChartProps {
  symbol: string;
  data: TradeData[];
  chartType?: 'line' | 'area' | 'candlestick' | 'volume';
  showVolume?: boolean;
  showMA?: boolean;
}

const AdvancedStockChart: React.FC<AdvancedStockChartProps> = ({
  symbol,
  data,
  chartType = 'line',
  showVolume = true,
  showMA = true
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((trade, index) => {
      const timestamp = new Date(trade.t);
      const previousPrice = index > 0 ? data[index - 1].p : trade.p;
      const change = trade.p - previousPrice;
      const changePercent = (change / previousPrice) * 100;

      return {
        time: timestamp.toLocaleTimeString(),
        timestamp: trade.t,
        price: trade.p,
        volume: trade.v,
        change,
        changePercent,
        high: trade.p + Math.random() * 2,
        low: trade.p - Math.random() * 2,
        open: previousPrice,
        close: trade.p,
        ma5: index >= 4 ? data.slice(index - 4, index + 1).reduce((sum, d) => sum + d.p, 0) / 5 : trade.p,
        ma20: index >= 19 ? data.slice(index - 19, index + 1).reduce((sum, d) => sum + d.p, 0) / 20 : trade.p,
      };
    });
  }, [data]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map(d => d.price);
    const volumes = chartData.map(d => d.volume);
    
    return {
      currentPrice: prices[prices.length - 1],
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      totalVolume: volumes.reduce((sum, vol) => sum + vol, 0),
      priceChange: prices[prices.length - 1] - prices[0],
      priceChangePercent: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100,
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-navy-300">Price: ${data.price.toFixed(2)}</p>
          <p className="text-gray-400">Volume: {data.volume.toFixed(4)}</p>
          <p className={`${data.change >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              fill="url(#priceGradient)"
              strokeWidth={2}
            />
            {showMA && (
              <>
                <Line type="monotone" dataKey="ma5" stroke="#f59e0b" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="ma20" stroke="#ef4444" strokeWidth={1} dot={false} />
              </>
            )}
          </AreaChart>
        );

      case 'candlestick':
        return (
          <BarChart {...commonProps} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="high" fill="#10b981" />
            <Bar dataKey="low" fill="#ef4444" />
            <Bar dataKey="open" fill="#f59e0b" />
            <Bar dataKey="close" fill="#3b82f6" />
          </BarChart>
        );

      case 'volume':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="volume" 
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tick={{ fill: '#9ca3af' }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            {showMA && (
              <>
                <Line type="monotone" dataKey="ma5" stroke="#f59e0b" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="ma20" stroke="#ef4444" strokeWidth={1} dot={false} />
              </>
            )}
          </LineChart>
        );
    }
  };

  if (!stats) {
    return (
      <div className="bg-dark-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-700 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">
            {symbol} - {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </h3>
          <div className="flex gap-2">
            <select 
              className="bg-dark-600 border border-dark-500 text-white rounded px-3 py-1 text-sm"
              onChange={(e) => console.log('Chart type:', e.target.value)}
            >
              <option value="line">Line</option>
              <option value="area">Area</option>
              <option value="candlestick">Candlestick</option>
              <option value="volume">Volume</option>
            </select>
            <select 
              className="bg-dark-600 border border-dark-500 text-white rounded px-3 py-1 text-sm"
              onChange={(e) => console.log('Time range:', e.target.value)}
            >
              <option value="1h">1H</option>
              <option value="4h">4H</option>
              <option value="1d">1D</option>
              <option value="1w">1W</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-dark-600 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Current Price</p>
            <p className="text-white font-bold text-lg">${stats.currentPrice.toFixed(2)}</p>
          </div>
          <div className="bg-dark-600 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Change</p>
            <p className={`font-bold text-lg ${stats.priceChange >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
              {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(2)}
            </p>
          </div>
          <div className="bg-dark-600 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Change %</p>
            <p className={`font-bold text-lg ${stats.priceChangePercent >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
              {stats.priceChangePercent >= 0 ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
            </p>
          </div>
          <div className="bg-dark-600 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Total Volume</p>
            <p className="text-white font-bold text-lg">{stats.totalVolume.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input 
            type="checkbox" 
            checked={showVolume} 
            onChange={(e) => console.log('Show volume:', e.target.checked)}
            className="rounded border-dark-500 bg-dark-600 text-navy-400"
          />
          Show Volume
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input 
            type="checkbox" 
            checked={showMA} 
            onChange={(e) => console.log('Show MA:', e.target.checked)}
            className="rounded border-dark-500 bg-dark-600 text-navy-400"
          />
          Moving Averages
        </label>
      </div>
    </div>
  );
};

export default AdvancedStockChart;
