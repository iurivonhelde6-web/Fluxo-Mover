import { useState, useEffect, useCallback, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const TABLE_NAME = 'pedidos_mover' 

  const [filters, setFilters] = useState({
    cliente_info: '',  
    frete: '',         
    data_entrega: '',  
    id_pedido: '',     
  })

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('id_pedido', { ascending: false });

      if (fetchError) throw fetchError
      setTransactions(data || [])
    } catch (err) {
      console.error('ERRO SUPABASE FETCH:', err.message)
      setError(err.message)
      setTransactions([]) 
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id_pedido', id);

      if (deleteError) throw deleteError
      setTransactions(prev => prev.filter(t => t.id_pedido !== id))
      return { success: true }
    } catch (err) {
      console.error('ERRO SUPABASE DELETE:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return []
    return transactions.filter(t => {
      const matchesCliente = !filters.cliente_info || 
        t.cliente_info?.toLowerCase().includes(filters.cliente_info.toLowerCase());
      const matchesFrete = !filters.frete || t.frete === filters.frete;
      return matchesCliente && matchesFrete;
    });
  }, [transactions, filters])

  const summary = useMemo(() => {
    const initial = { totalEntradas: 0, saldo: 0, faturado: 0, quantidade: 0, totalPendente: 0 }
    if (!filteredTransactions.length) return initial

    return filteredTransactions.reduce((acc, t) => {
      const pago = Number(t.valor_pago) || 0
      const total = Number(t.valor_total) || 0
      const pendente = Number(t.valor_restante) || 0
      return {
        ...acc,
        totalEntradas: acc.totalEntradas + pago,
        saldo: acc.saldo + pago,
        faturado: acc.faturado + total,
        totalPendente: acc.totalPendente + pendente,
        quantidade: acc.quantidade + 1
      }
    }, initial)
  }, [filteredTransactions])

  // LÓGICA PARA GRÁFICOS MENSAIS (Resolve os gráficos em branco)
  const transactionsByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dataMap = months.map(label => ({ label, entradas: 0, saidas: 0 }));

    // Se não houver transações, retorna o mapa vazio formatado
    if (!filteredTransactions || filteredTransactions.length === 0) return dataMap;

    filteredTransactions.forEach(t => {
      // Verificação ultra segura da data
      const dataStr = t?.data_entrega;
      if (dataStr && typeof dataStr === 'string' && dataStr.includes('.')) {
        const partes = dataStr.split('.');
        if (partes.length >= 2) {
          const mesIndex = parseInt(partes[1], 10) - 1;
          if (mesIndex >= 0 && mesIndex < 12) {
            dataMap[mesIndex].entradas += Number(t.valor_pago) || 0;
          }
        }
      }
    });
    return dataMap;
  }, [filteredTransactions]);

  // LÓGICA POR CATEGORIA/FRETE
  const transactionsByCategory = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      const cat = t.frete || 'Geral' 
      if (!grouped[cat]) grouped[cat] = { entrada: 0, saida: 0 }
      grouped[cat].entrada += (Number(t.valor_pago) || 0)
    })
    return grouped
  }, [filteredTransactions])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions: filteredTransactions,
    loading,
    error,
    filters,
    setFilters,
    summary,
    transactionsByMonth,
    transactionsByCategory,
    fetchTransactions,
    deleteTransaction,
  }
}
