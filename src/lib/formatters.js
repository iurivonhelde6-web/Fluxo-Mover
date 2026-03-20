// =========================
// 💰 FORMATAR MOEDA
// =========================
export const formatCurrency = (v) => {
  const n = Number(v);

  if (!isFinite(n)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
};

// =========================
// 📅 FORMATAR DATA (DISPLAY)
// =========================
export const formatDate = (d) => {
  if (typeof d !== 'string' || !d.trim()) return '-';

  try {
    const clean = d.trim();

    // ISO: 2024-01-01T00:00:00
    if (clean.includes('T')) {
      const [date] = clean.split('T');
      return formatDate(date);
    }

    // YYYY-MM-DD → DD/MM/YYYY
    if (clean.includes('-')) {
      const parts = clean.split('-');

      if (parts.length === 3) {
        return parts.reverse().join('/');
      }
    }

    return clean;
  } catch {
    return '-';
  }
};

// =========================
// 📅 FORMATAR DATA PARA INPUT
// =========================
export const formatDateForInput = (d) => {
  if (typeof d !== 'string' || !d.trim()) return '';

  try {
    const clean = d.trim();

    // ISO → pega só a data
    if (clean.includes('T')) {
      return clean.split('T')[0];
    }

    // já está em formato válido
    if (clean.includes('-')) return clean;

    return '';
  } catch {
    return '';
  }
};

// =========================
// 📆 NOME DO MÊS
// =========================
export const getMonthName = (i) => {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const index = Number(i);

  if (!Number.isInteger(index) || index < 0 || index > 11) {
    return '';
  }

  return months[index];
};

// =========================
// 🔤 FORMATAR TIPO TRANSAÇÃO
// =========================
export const formatTransactionType = (t) => {
  if (typeof t !== 'string' || !t.trim()) return 'Entrada';

  const clean = t.trim().toLowerCase();

  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

// =========================
// 🎨 CLASSE DO TIPO TRANSAÇÃO
// =========================
export const getTransactionTypeClass = (t) => {
  const type = String(t || '').trim().toLowerCase();

  const isSaida = type === 'saida' || type === 'saída';

  return isSaida
    ? 'bg-red-100 text-red-700'
    : 'bg-sage-100 text-sage-700';
};
