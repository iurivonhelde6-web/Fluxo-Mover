export const formatCurrency = (v) => {
  const n = Number(v);
  return isNaN(n) ? 'R$ 0,00' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
};

export const formatDate = (d) => {
  if (!d || typeof d !== 'string') return '-';
  try {
    if (d.includes('T')) return d.split('T')[0].split('-').reverse().join('/');
    if (d.includes('-')) return d.split('-').reverse().join('/');
    return d;
  } catch { return '-'; }
};

export const formatDateForInput = (d) => {
  if (!d || typeof d !== 'string') return '';
  return d.includes('T') ? d.split('T')[0] : d;
};

export const getMonthName = (i) => {
  const m = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return m[i] || '';
};

export const formatTransactionType = (t) => t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : 'Entrada';

export const getTransactionTypeClass = (t) => {
  const type = String(t || 'entrada').toLowerCase();
  return (type === 'saida' || type === 'saída') ? 'bg-red-100 text-red-700' : 'bg-sage-100 text-sage-700';
};
