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
  // Se a data não existir ou não for texto, retorna um traço e NÃO QUEBRA O APP
  if (!date || typeof date !== 'string') return '-';
  try {
    if (date.includes('T')) return date.split('T')[0].split('-').reverse().join('/');
    if (date.includes('-')) return date.split('-').reverse().join('/');
    return date; 
  } catch (error) {
    return '-';
  }
};

export const formatDateForInput = (date) => {
  if (!date || typeof date !== 'string') return '';
  try {
    return date.includes('T') ? date.split('T')[0] : date;
  } catch (error) {
    return '';
  }
};

export const formatTransactionType = (type) => {
  if (!type || typeof type !== 'string') return 'Entrada';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export const getTransactionTypeClass = (type) => {
  const t = String(type || 'entrada').toLowerCase();
  return t === 'saida' || t === 'saída' ? 'bg-red-100 text-red-700' : 'bg-sage-100 text-sage-700';
};

export const getMonthName = (monthIndex) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return months[monthIndex] || '';
};
