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
        .order('id_pedido','valor_total','valor_pago','valor_restante'  { ascending: false }) // Ajustado para id_pedido

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
        .eq('id_pedido', id) // 1. Aqui você já mudou, está correto!

      if (deleteError) throw deleteError

      // 2. MUDANÇA AQUI: Ajustar de 't.id' para 't.id_pedido'
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
    const initial = { 
      totalEntradas: 0, 
      totalSaidas: 0, 
      saldo: 0, 
      quantidade: 0,
      // Adicionais para garantir compatibilidade:
      receita: 0,
      faturado: 0
    }
    
    if (!filteredTransactions || filteredTransactions.length === 0) return initial

    return filteredTransactions.reduce((acc, t) => {
      // Convertemos para número para evitar problemas com texto
      const pago = Number(t.valor_pago) || 0
      const total = Number(t.valor_total) || 0
      const restante = Number(t.valor_restante) || 0

      return {
        ...acc,
        totalEntradas: acc.totalEntradas + pago,
        saldo: acc.saldo + pago,
        receita: acc.receita + pago,
        faturado: acc.faturado + total,
        totalPendente: (acc.totalPendente || 0) + restante,
        quantidade: acc.quantidade + 1
      }
    }, initial)
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
