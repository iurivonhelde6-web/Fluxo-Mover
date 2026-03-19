import { useState, useEffect, useCallback, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const TABLE_NAME = 'pedidos_mover' 

  const [filters, setFilters] = useState({
    tipo: '',
    categoria: '',
    cliente_id: '',
    dataInicio: '',
    dataFim: '',
  })

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('id_pedido', { ascending: false })

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

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const { data, error: createError } = await supabase
        .from(TABLE_NAME)
        .insert([transactionData])
        .select()

      if (createError) throw createError
      if (data) setTransactions(prev => [data[0], ...prev])
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('ERRO SUPABASE CREATE:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      setTransactions(prev => prev.filter(t => t.id !== id))
      return { success: true }
    } catch (err) {
      console.error('ERRO SUPABASE DELETE:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // PROTEÇÃO: Filtros com verificação de array
  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return []
    return transactions.filter(t => {
      if (filters.tipo && t.tipo !== filters.tipo) return false
      if (filters.categoria && t.categoria !== filters.categoria) return false
      return true
    })
  }, [transactions, filters])

  // PROTEÇÃO: Summary que nunca retorna undefined (Evita erro 'reading saldo')
 // PROTEÇÃO: Summary adaptado para as colunas da sua tabela pedidos_mover
  const summary = useMemo(() => {
    const initial = { totalEntradas: 0, totalSaidas: 0, saldo: 0, quantidade: 0 }
    if (!filteredTransactions.length) return initial

    // Na sua tabela, 'valor_pago' é o que realmente entrou
    const entradas = filteredTransactions.reduce((sum, t) => {
      return sum + (Number(t.valor_pago) || 0)
    }, 0)
    
    // Se você não tiver uma coluna de 'saida' na pedidos_mover, 
    // o total de saídas será 0 por enquanto.
    const saidas = 0 

    return {
      totalEntradas: entradas,
      totalSaidas: saidas,
      saldo: entradas - saidas,
      quantidade: filteredTransactions.length,
    }
  }, [filteredTransactions])

  // Ajuste para não quebrar se a coluna 'categoria' ou 'tipo' não existir
  const transactionsByCategory = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      // Como não vi coluna 'categoria' na sua imagem, usei 'frete' ou 'Outros' como exemplo
      const cat = t.categoria || t.frete || 'Pedidos' 
      if (!grouped[cat]) grouped[cat] = { entrada: 0, saida: 0 }
      
      // Consideramos tudo como entrada (pago) já que é uma tabela de pedidos
      grouped[cat]['entrada'] += (Number(t.valor_pago) || 0)
    })
    return grouped
  }, [filteredTransactions])
  // PROTEÇÃO: Evita erro no Object.entries
  const transactionsByCategory = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      const cat = t.categoria || 'Outros'
      if (!grouped[cat]) grouped[cat] = { entrada: 0, saida: 0 }
      grouped[cat][t.tipo] += (Number(t.valor) || 0)
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
    summary, // Agora garantido que não é undefined
    transactionsByCategory,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  }
}
