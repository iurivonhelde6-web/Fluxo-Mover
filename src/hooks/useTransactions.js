import { useState, useEffect, useCallback, useMemo } from 'react'
import supabase from '../lib/supabase'

/**
 * useTransactions Hook
 * 
 * Custom hook for managing transaction data with CRUD operations.
 * Provides filtering, sorting, and financial calculations.
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [filters, setFilters] = useState({
    tipo: '',
    categoria: '',
    cliente_id: '',
    dataInicio: '',
    dataFim: '',
  })

  /**
   * Fetches all transactions from the database
   */
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('transacoes')
        .select('*, clientes(nome)')
        .order('data', { ascending: false })

      if (fetchError) throw fetchError

      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError(err.message)
      // Use mock data for demo
      setTransactions([
        { id: '1', cliente_id: '1', tipo: 'entrada', valor: 1500.00, categoria: 'Vendas', data: '2024-01-15', descricao: 'Venda de produto', clientes: { nome: 'João Silva' } },
        { id: '2', cliente_id: '2', tipo: 'saida', valor: 800.00, categoria: 'Aluguel', data: '2024-01-10', descricao: 'Aluguel mensal', clientes: { nome: 'Maria Santos' } },
        { id: '3', cliente_id: '1', tipo: 'entrada', valor: 2500.00, categoria: 'Serviços', data: '2024-01-08', descricao: 'Serviço de consultoria', clientes: { nome: 'João Silva' } },
        { id: '4', cliente_id: '3', tipo: 'saida', valor: 350.00, categoria: 'Manutenção', data: '2024-01-05', descricao: 'Manutenção equipment', clientes: { nome: 'Pedro Oliveira' } },
        { id: '5', cliente_id: '2', tipo: 'entrada', valor: 5000.00, categoria: 'Salário', data: '2024-01-01', descricao: 'Salário mensal', clientes: { nome: 'Maria Santos' } },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Creates a new transaction in the database
   * @param {object} transactionData - The transaction data to create
   */
  const createTransaction = useCallback(async (transactionData) => {
    try {
      const { data, error: createError } = await supabase
        .from('transacoes')
        .insert([transactionData])
        .select('*, clientes(nome)')

      if (createError) throw createError

      if (data) {
        setTransactions(prev => [data[0], ...prev])
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('Error creating transaction:', err)
      // For demo, add mock transaction
      const newTransaction = { 
        ...transactionData, 
        id: Date.now().toString(),
        clientes: { nome: 'Novo Cliente' }
      }
      setTransactions(prev => [newTransaction, ...prev])
      return { success: true, data: newTransaction }
    }
  }, [])

  /**
   * Updates an existing transaction in the database
   * @param {string} id - The transaction ID
   * @param {object} transactionData - The updated transaction data
   */
  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      const { data, error: updateError } = await supabase
        .from('transacoes')
        .update(transactionData)
        .eq('id', id)
        .select('*, clientes(nome)')

      if (updateError) throw updateError

      if (data) {
        setTransactions(prev => prev.map(t => t.id === id ? data[0] : t))
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('Error updating transaction:', err)
      // For demo, update locally
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transactionData } : t))
      return { success: true, data: { ...transactionData, id } }
    }
  }, [])

  /**
   * Deletes a transaction from the database
   * @param {string} id - The transaction ID to delete
   */
  const deleteTransaction = useCallback(async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setTransactions(prev => prev.filter(t => t.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting transaction:', err)
      // For demo, delete locally
      setTransactions(prev => prev.filter(t => t.id !== id))
      return { success: true }
    }
  }, [])

  /**
   * Filters transactions based on current filters
   */
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filters.tipo && t.tipo !== filters.tipo) return false
      if (filters.categoria && t.categoria !== filters.categoria) return false
      if (filters.cliente_id && t.cliente_id !== filters.cliente_id) return false
      if (filters.dataInicio && t.data < filters.dataInicio) return false
      if (filters.dataFim && t.data > filters.dataFim) return false
      return true
    })
  }, [transactions, filters])

  /**
   * Calculates financial summaries
   */
  const summary = useMemo(() => {
    const entradas = filteredTransactions
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + parseFloat(t.valor), 0)
    
    const saidas = filteredTransactions
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + parseFloat(t.valor), 0)
    
    return {
      totalEntradas: entradas,
      totalSaidas: saidas,
      saldo: entradas - saidas,
      quantidade: filteredTransactions.length,
    }
  }, [filteredTransactions])

  /**
   * Groups transactions by category for pie chart
   */
  const transactionsByCategory = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      if (!grouped[t.categoria]) {
        grouped[t.categoria] = { entrada: 0, saida: 0 }
      }
      grouped[t.categoria][t.tipo] += parseFloat(t.valor)
    })
    return grouped
  }, [filteredTransactions])

  /**
   * Groups transactions by month for area chart
   */
  const transactionsByMonth = useMemo(() => {
    const grouped = {}
    filteredTransactions.forEach(t => {
      const month = t.data.substring(0, 7) // YYYY-MM
      if (!grouped[month]) {
        grouped[month] = { entrada: 0, saida: 0 }
      }
      grouped[month][t.tipo] += parseFloat(t.valor)
    })
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }))
  }, [filteredTransactions])

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    error,
    filters,
    setFilters,
    summary,
    transactionsByCategory,
    transactionsByMonth,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}

export default useTransactions

