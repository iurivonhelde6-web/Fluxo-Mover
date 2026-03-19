import { useState, useEffect, useCallback } from 'react'
import supabase from '../lib/supabase'

export const useClients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Nome da sua tabela no Supabase
  const TABLE_NAME = 'pedidos_mover'

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // CORREÇÃO AQUI: Usando a variável TABLE_NAME em vez de pedidos_mover solto
      const { data, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('id_pedido', { ascending: false })

      if (fetchError) throw fetchError

      setClients(data || [])
    } catch (err) {
      console.error('Erro ao buscar clientes:', err.message)
      setError(err.message)
      setClients([]) // Limpa a lista se houver erro real
    } finally {
      setLoading(false)
    }
  }, [])

  const createClient = useCallback(async (clientData) => {
    try {
      // CORREÇÃO AQUI TAMBÉM
      const { data, error: createError } = await supabase
        .from(TABLE_NAME)
        .insert([clientData])
        .select()

      if (createError) throw createError

      if (data) {
        setClients(prev => [data[0], ...prev])
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('Erro ao criar cliente:', err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const deleteClient = useCallback(async (id) => {
    try {
      // E CORREÇÃO AQUI
      const { error: deleteError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

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
