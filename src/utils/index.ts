// Funções de formatação de números
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toFixed(2);
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1000000) return (volume / 1000000).toFixed(2) + 'M';
  if (volume >= 1000) return (volume / 1000).toFixed(2) + 'K';
  return volume.toString();
};

// Função para salvar símbolos iniciais no localStorage
export const storageInitialSymbols = (symbols: string[]): void => {
  try {
    localStorage.setItem('initial_symbols', JSON.stringify(symbols));
  } catch (error) {
    console.error('Erro ao salvar símbolos no localStorage:', error);
  }
};

// Função para recuperar símbolos iniciais do localStorage
export const getStoredInitialSymbols = (): string[] => {
  try {
    const stored = localStorage.getItem('initial_symbols');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao recuperar símbolos do localStorage:', error);
    return [];
  }
};
