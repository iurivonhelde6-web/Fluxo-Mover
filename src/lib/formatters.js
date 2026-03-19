// src/lib/formatters.js

export const formatCurrency = (value) => {
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num);
};

export const formatDate = (date) => {
  // AQUI ESTÁ A CURA DA TELA BRANCA:
  // Se a data for vazia, nula, ou não for um texto, retorna apenas um traço e não quebra o sistema.
  if (!date || typeof date !== 'string') return '-';
  
  try {
    // Se for formato ISO de banco de dados (ex: 2024-03-19T10:00:00)
    if (date.includes('T')) {
      const dataApenas = date.split('T')[0];
      return dataApenas.split('-').reverse().join('/');
    }
    // Se for formato de banco tradicional (ex: 2024-03-19)
    if (date.includes('-')) {
      return date.split('-').reverse().join('/');
    }
    // Se já for o seu formato customizado (ex: 02.03)
    return date; 
  } catch (error) {
    // Se der qualquer erro bizarro no split, ele captura e não deixa a tela branca
    console.error("Erro ao formatar data:", date);
    return '-';
  }
};

export const formatTransactionType = (type) => {
  if (!type || typeof type !== 'string') return 'Entrada';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export const getTransactionTypeClass = (type) => {
  // Como no seu banco atual só existem entradas (vendas), garantimos a cor verde
  const tipoSeguro = type ? type.toLowerCase() : 'entrada';
  return tipoSeguro === 'saida' || tipoSeguro === 'saída'
    ? 'bg-red-100 text-red-700'
    : 'bg-sage-100 text-sage-700';
};
