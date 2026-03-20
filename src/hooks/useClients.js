import { useState, useEffect, useCallback } from 'react'
import supabase from '../lib/supabase'

export const useClients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const TABLE_NAME = 'pedidos_mover'

  const normalizeClient = (item) => {
    if (!item || typeof item !== 'object') return null

    return {
      id: item.id_pedido ?? null,
      nome: item.cliente_info ?? 'Sem nome',
      raw: item // mantém original se precisar
    }
  }

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('cliente_info', { ascending: false })

      if (fetchError) throw fetchError

      const safeData = Array.isArray(data)
        ? data
            .filter(Boolean)
            .map(normalizeClient)
            .filter(Boolean)
        : []

      setClients(safeData)

    } catch (err) {
      console.error('Erro ao buscar clientes:', err.message)
      setError(err.message)
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createClient = useCallback(async (clientData) => {
    try {
      const { data, error: createError } = await supabase
        .from(TABLE_NAME)
        .insert([clientData])
        .select()

      if (createError) throw createError

      const newClient = normalizeClient(data?.[0])

      if (newClient) {
        setClients(prev => [newClient, ...prev])
      }

      return { success: true, data: newClient }

    } catch (err) {
      console.error('Erro ao criar cliente:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const deleteClient = useCallback(async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id_pedido', id) // ✅ corrigido

      if (deleteError) throw deleteError

      setClients(prev => prev.filter(c => c.id !== id))

      return { success: true }

    } catch (err) {
      console.error('Erro ao deletar cliente:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    deleteClient,
  }
}

export default useClients
