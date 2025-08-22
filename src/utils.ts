const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toFixed(2);
};

const formatVolume = (volume: number): string => {
  if (volume >= 1000000) return (volume / 1000000).toFixed(2) + 'M';
  if (volume >= 1000) return (volume / 1000).toFixed(2) + 'K';
  return volume.toString();
};

const storageInitialSymbols = (symbols: string[]) => {
  localStorage.setItem('initialSymbols', JSON.stringify(symbols));
}

const getInitialSymbols = () => {
  const symbols = localStorage.getItem('initialSymbols');
  // add regex to check if the symbols are valid
  const regex = /^[A-Z]{2,5}:[A-Z]{2,5}$/;
  const validSymbols = symbols?.split(',').filter(symbol => regex.test(symbol));
  return validSymbols ? validSymbols : ['AAPL', 'MSFT', 'GOOGL'];
}

export { formatNumber, formatVolume, storageInitialSymbols, getInitialSymbols };