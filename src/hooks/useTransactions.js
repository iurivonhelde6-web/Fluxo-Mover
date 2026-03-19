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
        .order('id_pedido', { ascending: false }) // Ajustado para id_pedido

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
        .eq('id_pedido', id) // Ajustado para id_pedido

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
    return transactions
  }, [transactions])

  const summary = useMemo(() => {
    const initial = { totalEntradas: 0, totalSaidas: 0, saldo: 0, quantidade: 0 }
    if (!filteredTransactions.length) return initial

    // Soma o valor_pago de todos os pedidos como Entrada
    const entradas = filteredTransactions.reduce((sum, t) => sum + (Number(t.valor_pago) || 0), 0)
    const saidas = 0 

    return {
      totalEntradas: entradas,
      totalSaidas: saidas,
      saldo: entradas - saidas,
      quantidade: filteredTransactions.length,
    }
  }, [filteredTransactions])

  const transactionsByCategory = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      const cat = t.frete || 'Geral' 
      if (!grouped[cat]) grouped[cat] = { entrada: 0, saida: 0 }
      grouped[cat]['entrada'] += (Number(t.valor_pago) || 0)
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
    transactionsByCategory,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  }
}
