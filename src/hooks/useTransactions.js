import { useState, useEffect, useMemo } from 'react'
import supabase from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // NORMALIZAÇÃO (mantendo nomes do banco)
  const normalizeTransaction = (t) => {
    if (!t || typeof t !== 'object') return null

    return {
      id_pedido: t.id_pedido ?? null,
      cliente_info: t.cliente_info ?? 'Sem nome',
      data_entrega: typeof t.data_entrega === 'string' ? t.data_entrega : '',
      valor_pago: Number(t.valor_pago ?? 0),
      valor_total: Number(t.valor_total ?? 0),
      valor_restante: Number(t.valor_restante ?? 0),
      frete: t.frete ?? 'Geral',
    }
  }

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

  // ✅ SUMMARY (CARDS)
  const summary = useMemo(() => {
    let receitas = 0
    let despesas = 0

    transactions.forEach(t => {
      receitas += Number(t.valor_pago || 0)
    })

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
    }
  }, [transactions])

  // ✅ POR CATEGORIA (USANDO FRETE)
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

  // ✅ POR MÊS
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
  }
}
