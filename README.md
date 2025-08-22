# 📈 Stock Price Dashboard

A modern, real-time stock price dashboard built with React, TypeScript, and Tailwind CSS. Monitor stock prices, crypto assets, and market data with beautiful charts and real-time updates.

## ✨ Features

- **Real-Time Trading Data** - Live WebSocket connection for instant price updates
- **Advanced Charts** - Multiple chart types (Line, Area, Candlestick, Volume) using Recharts
- **Dark Theme** - Modern dark UI with custom color palette
- **Stock Search** - Search and filter stocks by symbol or name
- **Watchlist Management** - Add/remove stocks to your personal watchlist
- **Market Overview** - Real-time market indices and statistics
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **WebSocket Integration** - Real-time data streaming from Finnhub API
- **Chart Dashboard** - Advanced charting with multiple timeframes and indicators

## 🚀 Technologies

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts library for data visualization
- **Real-Time**: WebSocket for live data streaming
- **API**: Finnhub for stock and crypto data
- **Build Tool**: Vite for fast development and building
- **State Management**: React Hooks for local state

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AdvancedStockChart.tsx    # Advanced charting component
│   ├── ChartDashboard.tsx        # Chart dashboard wrapper
│   ├── RealTimeTrading.tsx       # Real-time trading interface
│   ├── SearchBar.tsx             # Stock search component
│   ├── StockCard.tsx             # Individual stock display
│   ├── StockChart.tsx            # Basic stock chart
│   └── Watchlist.tsx             # Watchlist management
├── hooks/              # Custom React hooks
│   ├── useApiConfig.ts # API configuration management
│   ├── useStocks.ts    # Stock data management
│   └── useTrading.ts   # Real-time trading data
├── services/           # API and data services
│   ├── stockService.ts # Mock stock data service
│   └── tradingService.ts # WebSocket trading service
├── types/              # TypeScript type definitions
│   └── stock.ts        # Stock and trading data types
├── config/             # Configuration files
│   └── env.ts          # Environment variables
└── App.tsx             # Main application component
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-price-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Finnhub API key:
   ```bash
   VITE_FINNHUB_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔑 API Configuration

### Required API Keys

- **Finnhub API Key** (Required): Get your free API key at [finnhub.io](https://finnhub.io/)

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Required
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here

# Optional
VITE_DEFAULT_SYMBOLS=AAPL,MSFT,GOOGL,BINANCE:BTCUSDT
VITE_CHART_UPDATE_INTERVAL=5000
VITE_MAX_DATA_POINTS=1000
```

## 📊 Supported Symbols

The dashboard supports various financial instruments:

- **Stocks**: AAPL, MSFT, GOOGL, TSLA, etc.
- **Crypto**: BINANCE:BTCUSDT, BINANCE:ETHUSDT, etc.
- **Forex**: IC MARKETS:1, IC MARKETS:2, etc.
- **Indices**: SPY, QQQ, DIA, etc.

## 🎨 Customization

### Color Palette

The dashboard uses a custom dark theme with these colors:

- **Primary**: Grayscale (#f0f0f0 to #101010)
- **Dark**: Deep blacks (#131313 to #090808)
- **Navy**: Blue tones (#171a4a to #2d2c79)
- **Purple**: Purple accents (#2d2c79 to #4c1d95)

### Chart Types

- **Line Chart**: Standard price line with moving averages
- **Area Chart**: Filled area chart with gradient
- **Candlestick**: OHLC data visualization
- **Volume**: Trading volume bars

### Time Frames

- 1 Hour (1H)
- 4 Hours (4H)
- 1 Day (1D)
- 1 Week (1W)

## 🔌 WebSocket Integration

The dashboard connects to Finnhub's WebSocket API for real-time data:

```typescript
// Subscribe to symbols
socket.send(JSON.stringify({
  type: 'subscribe',
  symbol: 'AAPL'
}));

// Unsubscribe from symbols
socket.send(JSON.stringify({
  type: 'unsubscribe',
  symbol: 'AAPL'
}));
```

## 📱 Responsive Design

- **Desktop**: Full dashboard with side-by-side charts
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Stacked layout with touch-friendly controls

## 🚀 Performance Features

- **Lazy Loading**: Charts load only when needed
- **Data Caching**: Recent data stored in memory
- **Optimized Rendering**: Efficient chart updates
- **WebSocket Management**: Automatic reconnection handling

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and style enforcement
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for code quality

## 📈 Chart Features

### Technical Indicators

- **Moving Averages**: MA5 and MA20 lines
- **Volume Analysis**: Trading volume visualization
- **Price Action**: High, Low, Open, Close data
- **Real-time Updates**: Live data streaming

### Chart Controls

- **Chart Type Selection**: Switch between chart types
- **Time Range**: Adjust viewing timeframe
- **Auto-refresh**: Automatic data updates
- **Export Options**: Save charts and data

## 🔒 Security

- **API Key Management**: Secure token storage
- **Environment Variables**: Sensitive data protection
- **HTTPS Only**: Secure connections in production
- **Input Validation**: Sanitized user inputs

## 🌟 Future Enhancements

- [ ] Additional technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Portfolio tracking and performance analytics
- [ ] News feed integration
- [ ] Price alerts and notifications
- [ ] Social trading features
- [ ] Advanced order management
- [ ] Multi-exchange support
- [ ] Historical data analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Finnhub](https://finnhub.io/) for providing financial data APIs
- [Recharts](https://recharts.org/) for the excellent charting library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Support

If you have any questions or need help:

- Create an issue in the GitHub repository
- Check the [documentation](ENV_SETUP.md) for setup instructions
- Review the [troubleshooting guide](ENV_SETUP.md#troubleshooting)

---

**Happy Trading! 📈💰**
