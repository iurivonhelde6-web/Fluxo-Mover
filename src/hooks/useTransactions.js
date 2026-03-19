import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

const TABLE_NAME = 'pedidos_mover'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('id_pedido', { ascending: false })

      if (fetchError) throw fetchError
      setTransactions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const transactionsByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const dataMap = months.map(label => ({ label, entradas: 0, saidas: 0 }))

    transactions.forEach(t => {
      // PROTEÇÃO TOTAL: Verifica se a data existe e se é uma string antes do split
      const dataStr = t?.data_entrega
      if (dataStr && typeof dataStr === 'string' && dataStr.includes('.')) {
        try {
          const partes = dataStr.split('.')
          const mesIndex = parseInt(partes[1], 10) - 1
          if (mesIndex >= 0 && mesIndex < 12) {
            dataMap[mesIndex].entradas += Number(t.valor_pago) || 0
          }
        } catch (e) {
          console.error("Erro ao processar linha:", t)
        }
      }
    })
    return dataMap
  }, [transactions])

  return {
    transactions,
    transactionsByMonth,
    loading,
    error,
    refresh: fetchTransactions
  }
}
