import { useState, useEffect, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // NORMALIZAÇÃO
const normalizeTransaction = (t) => {
  if (!t || typeof t !== 'object') return null

  return {
    id: t.id, // 🔥 ADICIONA ISSO
    id_pedido: t.id_pedido ?? null,
    cliente_info: t.cliente_info ?? 'Sem nome',
    data_entrega: typeof t.data_entrega === 'string' ? t.data_entrega : '',
    valor_pago: Number(t.valor_pago ?? 0),
    valor_total: Number(t.valor_total ?? 0),
    valor_restante: Number(t.valor_restante ?? 0),
    frete: t.frete ?? 'Geral',
  }
}

  // FETCH
  const fetchTransactions = async () => {
    try {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('pedidos_mover')
        .select('*')
        .order('id_pedido', { ascending: false })

      if (fetchError) throw fetchError

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
      const mappedData = {
        cliente_info: formData.cliente,
        valor_pago: Number(formData.valor),
        data_entrega: formData.data,
        frete: formData.categoria || 'Geral',
      }

      const { data, error } = await supabase
        .from('pedidos_mover')
        .insert([mappedData])
        .select()

      if (error) throw error

      if (data) {
        const newItems = data.map(normalizeTransaction).filter(Boolean)
        setTransactions(prev => [...newItems, ...prev])
      }

      return { success: true }
    } catch (err) {
      console.error('Erro ao criar transação:', err)
      return { success: false, error: err.message }
    }
  }

  // ✅ DELETE (🔥 FALTAVA ISSO)
  const deleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('pedidos_mover')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(prev => prev.filter(t => t.id_pedido !== id))

      return { success: true }
    } catch (err) {
      console.error('Erro ao deletar:', err.message)
      return { success: false, error: err.message }
    }
  }

  // ✅ UPDATE (opcional mas importante)
  const updateTransaction = async (id, formData) => {
    try {
      const mappedData = {
        cliente_info: formData.cliente,
        valor_pago: Number(formData.valor),
        data_entrega: formData.data,
        frete: formData.categoria || 'Geral',
      }

      const { data, error } = await supabase
        .from('pedidos_mover')
        .update(mappedData)
        .eq('id', id)
        .select()

      if (error) throw error

      if (data) {
        const updated = normalizeTransaction(data[0])

        setTransactions(prev =>
          prev.map(t => (t.id_pedido === id ? updated : t))
        )
      }

      return { success: true }
    } catch (err) {
      console.error('Erro ao atualizar:', err.message)
      return { success: false, error: err.message }
    }
  }

  // SUMMARY
  const summary = useMemo(() => {
    let entradas = 0
    let saidas = 0

    transactions.forEach(t => {
      entradas += Number(t.valor_pago || 0)
    })

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
    }
  }, [transactions])

  // POR CATEGORIA
  const transactionsByCategory = useMemo(() => {
    const result = {}

    transactions.forEach(t => {
      const categoria = t.frete || 'Outros'
      const valor = Number(t.valor_pago || 0)

      if (!result[categoria]) {
        result[categoria] = { entrada: 0, saida: 0 }
      }

      result[categoria].entrada += valor
    })

    return result
  }, [transactions])

  // POR MÊS
  const transactionsByMonth = useMemo(() => {
    const dataMap = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      .map(label => ({ label, entrada: 0, saida: 0 }))

    transactions.forEach(t => {
      const dataStr = t.data_entrega

      if (dataStr && typeof dataStr === 'string' && dataStr.includes('.')) {
        const partes = dataStr.split('.')
        const mesIndex = parseInt(partes[1], 10) - 1

        if (mesIndex >= 0 && mesIndex < 12) {
          dataMap[mesIndex].entrada += Number(t.valor_pago || 0)
        }
      }
    })

    return dataMap
  }, [transactions])

  return {
    transactions,
    summary,
    transactionsByCategory,
    transactionsByMonth,
    loading,
    error,
    createTransaction,
    deleteTransaction,   // ✅ AGORA EXISTE
    updateTransaction,   // ✅ AGORA EXISTE
  }
}
