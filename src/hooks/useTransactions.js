import { useState, useEffect, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ NORMALIZAÇÃO
  const normalizeTransaction = (t) => {
    if (!t || typeof t !== 'object') return null

    return {
      id: t.id,
      cliente_info: t.cliente_info ?? 'Sem nome',
      data_entrega: t.data_entrega || '',
      valor_pago: Number(t.valor_pago ?? 0),
      valor_total: Number(t.valor_total ?? 0),
      valor_restante: Number(t.valor_restante ?? 0),
      frete: t.frete ?? 'Geral',
      tipo: t.tipo ?? 'entrada',
    }
  }

  // ✅ FETCH
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
      const isEntrada = formData.tipo === 'entrada'

      const mappedData = {
        cliente_info: formData.cliente,
        valor_pago: isEntrada ? Number(formData.valor) : 0,
        valor_total: Number(formData.valor),
        valor_restante: isEntrada ? 0 : Number(formData.valor),
        data_entrega: formData.data,
        frete: formData.categoria || 'Geral',
        tipo: formData.tipo,
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
      console.error('Erro ao criar:', err)
      return { success: false, error: err.message }
    }
  }

  // ✅ UPDATE
  const updateTransaction = async (id, formData) => {
    try {
      const isEntrada = formData.tipo === 'entrada'

      const { error } = await supabase
        .from('pedidos_mover')
        .update({
          cliente_info: formData.cliente,
          valor_pago: isEntrada ? Number(formData.valor) : 0,
          valor_total: Number(formData.valor),
          valor_restante: isEntrada ? 0 : Number(formData.valor),
          data_entrega: formData.data,
          frete: formData.categoria,
          tipo: formData.tipo,
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

  // ✅ SUMMARY (CORRIGIDO)
  const summary = useMemo(() => {
    let entradas = 0
    let saidas = 0

    transactions.forEach(t => {
      if (t.tipo === 'entrada') {
        entradas += Number(t.valor_pago || 0) // ✅ CORRETO
      } else {
        saidas += Number(t.valor_total || 0)
      }
    })

    return {
      totalEntradas: entradas,
      totalSaidas: saidas,
      saldo: entradas - saidas,
    }
  }, [transactions])

  // ✅ GRÁFICO POR CATEGORIA (VOLTOU)
  const transactionsByCategory = useMemo(() => {
    const result = {}

    transactions.forEach(t => {
      const categoria = t.frete || 'Outros'
      const valor = t.tipo === 'entrada'
        ? Number(t.valor_pago || 0)
        : Number(t.valor_total || 0)

      if (!result[categoria]) {
        result[categoria] = { entrada: 0, saida: 0 }
      }

      if (t.tipo === 'entrada') {
        result[categoria].entrada += valor
      } else {
        result[categoria].saida += valor
      }
    })

    return result
  }, [transactions])

  // ✅ GRÁFICO POR MÊS (VOLTOU)
  const transactionsByMonth = useMemo(() => {
    const meses = Array.from({ length: 12 }, (_, i) => ({
      label: i + 1,
      entrada: 0,
      saida: 0,
    }))

    transactions.forEach(t => {
      if (!t.data_entrega) return

      const date = new Date(t.data_entrega)
      const mes = date.getMonth()

      if (t.tipo === 'entrada') {
        meses[mes].entrada += Number(t.valor_pago || 0)
      } else {
        meses[mes].saida += Number(t.valor_total || 0)
      }
    })

    return meses
  }, [transactions])

  return {
    transactions,
    summary,
    transactionsByCategory,
    transactionsByMonth,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
