import { useState, useEffect, useCallback, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // AJUSTE AQUI: Use o nome correto da sua tabela de transações do banco MOVER
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
      
      // Removi o ', clientes(nome)' temporariamente para evitar erro de relação
      // Se você tiver a FK configurada, pode voltar com ele depois
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*') 
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setTransactions(data || [])
    } catch (err) {
      console.error('ERRO SUPABASE FETCH:', err.message)
      setError(err.message)
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
      // CORRIGIDO: Era setClients, mudei para setTransactions
      setTransactions(prev => prev.filter(t => t.id !== id))
      return { success: true }
    } catch (err) {
      console.error('ERRO SUPABASE DELETE:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // CORRIGIDO: Adicionado o filtro que faltava para evitar tela branca
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filters.tipo && t.tipo !== filters.tipo) return false
      if (filters.categoria && t.categoria !== filters.categoria) return false
      return true
    })
  }, [transactions, filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions: filteredTransactions,
    loading,
    error,
    filters,
    setFilters,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  }
}

