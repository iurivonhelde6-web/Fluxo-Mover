import { useState, useEffect, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizeTransaction = (t) => {
    if (!t || typeof t !== 'object') return null

    return {
  id: t.id,
  cliente_info: t.cliente_info ?? 'Sem nome',
  data_entrega: t.data_entrega ?? '',
  valor_pago: Number(t.valor_pago ?? 0),
  valor_total: Number(t.valor_total ?? 0),
  valor_restante: Number(t.valor_restante ?? 0),
  frete: t.frete ?? 'Geral',
  tipo: t.tipo ?? 'entrada', // ✅ NOVO
}

  const fetchTransactions = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('pedidos_mover')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error

      const safeData = Array.isArray(data)
        ? data.map(normalizeTransaction).filter(Boolean)
        : []

      setTransactions(safeData)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // ✅ CREATE
  const createTransaction = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('pedidos_mover')
        .insert([
  {
    cliente_info: formData.cliente,
    valor_pago: Number(formData.valor),
    data_entrega: formData.data,
    frete: formData.categoria || 'Geral',
    tipo: formData.tipo || 'entrada', // ✅ NOVO
  }
])
        .select()

      if (error) throw error

      const newItems = data.map(normalizeTransaction)
      setTransactions(prev => [...newItems, ...prev])

    } catch (err) {
      console.error('Erro ao criar:', err)
    }
  }

  // ✅ UPDATE
  const updateTransaction = async (id, formData) => {
    try {
      const { error } = await supabase
        .from('pedidos_mover')
        .update({
          cliente_info: formData.cliente,
          valor_pago: Number(formData.valor),
          data_entrega: formData.data,
          frete: formData.categoria,
        })
        .eq('id', id)

      if (error) throw error

      fetchTransactions()
    } catch (err) {
      console.error('Erro ao atualizar:', err)
    }
  }

  // ✅ DELETE
  const deleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('pedidos_mover')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
  }

  // ✅ SUMMARY
  const summary = useMemo(() => {
    let entradas = 0

    transactions.forEach(t => {
      entradas += t.valor_pago
    })

    return {
      totalEntradas: entradas,
      totalSaidas: 0,
      saldo: entradas,
    }
  }, [transactions])

  return {
    transactions,
    summary,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
