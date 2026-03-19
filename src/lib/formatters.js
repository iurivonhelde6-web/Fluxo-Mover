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
  if (!date || typeof date !== 'string') return '-';
  try {
    if (date.includes('T')) {
      const dataApenas = date.split('T')[0];
      return dataApenas.split('-').reverse().join('/');
    }
    if (date.includes('-')) {
      return date.split('-').reverse().join('/');
    }
    return date; 
  } catch (error) {
    return '-';
  }
};

// ESSA FUNÇÃO É NECESSÁRIA PARA O TRANSACTION FORM
export const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    if (typeof date === 'string' && date.includes('T')) {
      return date.split('T')[0];
    }
    return date;
  } catch (error) {
    return '';
  }
};

export const formatTransactionType = (type) => {
  if (!type || typeof type !== 'string') return 'Entrada';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export const getTransactionTypeClass = (type) => {
  const tipoSeguro = type ? type.toLowerCase() : 'entrada';
  return tipoSeguro === 'saida' || tipoSeguro === 'saída'
    ? 'bg-red-100 text-red-700'
    : 'bg-sage-100 text-sage-700';
};

// ESSA FUNÇÃO É NECESSÁRIA PARA O DASHBOARD (CHARTS)
export const getMonthName = (monthIndex) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months[monthIndex] || '';
};
