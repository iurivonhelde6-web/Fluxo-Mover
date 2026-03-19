import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('pedidos_mover')
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

  useEffect(() => { fetchTransactions() }, [])

  const transactionsByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const dataMap = months.map(label => ({ label, entradas: 0, saidas: 0 }))

    transactions.forEach(t => {
      // SEGURANÇA MÁXIMA: Só faz o split se data_entrega for uma string válida
      const dataStr = t?.data_entrega
      if (typeof dataStr === 'string' && dataStr.includes('.')) {
        const partes = dataStr.split('.')
        const mesIndex = parseInt(partes[1], 10) - 1
        if (mesIndex >= 0 && mesIndex < 12) {
          dataMap[mesIndex].entradas += Number(t.valor_pago || 0)
        }
      }
    })
    return dataMap
  }, [transactions])

  return { transactions, transactionsByMonth, loading, error }
}
