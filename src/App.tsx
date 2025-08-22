import RealTimeTrading from './components/RealTimeTrading';
import { useStocks } from './hooks/useStocks';
import { ChartLineUp } from '@phosphor-icons/react';

function App() {
  const {
    watchlist,
    loading
  } = useStocks();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-navy-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-navy-900 to-purple-900">
      <header className="bg-dark-800/50 backdrop-blur-lg border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <ChartLineUp size={32} />
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <RealTimeTrading 
            initialSymbols={['AAPL', 'MSFT', 'GOOGL']} // Símbolos mais apropriados para teste
            watchlist={watchlist}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
