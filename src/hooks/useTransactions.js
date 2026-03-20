import { useState, useEffect, useMemo } from 'react'
import supabase from '../lib/supabase' // ✅ padronizado

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizeTransaction = (t) => {
    if (!t || typeof t !== 'object') return null

    return {
      id: t.id_pedido ?? null,
      cliente: t.cliente_info ?? 'Sem nome',
      data: typeof t.data_entrega === 'string' ? t.data_entrega : '',
      valor: Number(t.valor_pago ?? 0),
      frete: t.frete ?? 'Geral',
      raw: t
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('pedidos_mover')
        .select('*')
        .order('id_pedido', { ascending: false })

      if (fetchError) throw fetchError

      const safeData = Array.isArray(data)
        ? data
            .filter(Boolean)
            .map(normalizeTransaction)
            .filter(Boolean)
        : []

      setTransactions(safeData)

    } catch (err) {
      setError(err.message)
      setTransactions([]) // ✅ evita lixo
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const transactionsByMonth = useMemo(() => {
    const dataMap = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ].map(label => ({ label, entradas: 0, saidas: 0 }))

    transactions.forEach(t => {
      const dataStr = t?.data

      if (typeof dataStr === 'string' && dataStr.includes('.')) {
        const partes = dataStr.split('.')
        const mesIndex = parseInt(partes[1], 10) - 1

        if (mesIndex >= 0 && mesIndex < 12) {
          dataMap[mesIndex].entradas += Number(t.valor || 0)
        }
      }
    })

    return dataMap
  }, [transactions])

  return {
    transactions,
    transactionsByMonth,
    loading,
    error
  }
}
