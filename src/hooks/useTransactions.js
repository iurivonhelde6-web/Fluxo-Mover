import { useState, useEffect, useCallback, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // NOME DA TABELA - Verifique se é 'transacoes' ou 'transacoes_mover'
  const TABLE_NAME = 'transacoes' 

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
      
      // NOTA: Se a tabela de clientes mudou de nome, o 'clientes(nome)' abaixo pode falhar.
      // Verifique a relação no Supabase.
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*, clientes(nome)') 
        .order('data', { ascending: false })

      if (fetchError) throw fetchError

      setTransactions(data || [])
    } catch (err) {
      console.error('ERRO REAL NO SUPABASE:', err.message)
      setError(err.message)
      setTransactions([]) // NUNCA coloque dados falsos aqui
    } finally {
      setLoading(false)
    }
  }, [])

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const { data, error: createError } = await supabase
        .from("pedidos_mover")
        .insert([transactionData])
        .select('*, clientes(nome)')

      if (createError) throw createError

      if (data) {
        setTransactions(prev => [data[0], ...prev])
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('Erro ao criar transação:', err.message)
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

      setClients(prev => prev.filter(t => t.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Erro ao deletar transação:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // ... (mantenha os useMemo de filtros e summary como estão, eles são apenas cálculos locais)

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

