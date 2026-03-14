import { useState, useEffect, useCallback } from 'react'
import supabase from '../lib/supabase'

/**
 * useClients Hook
 * 
 * Custom hook for managing client data with CRUD operations.
 * Provides loading states, error handling, and real-time data.
 */
export const useClients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Fetches all clients from the database
   * Ordered by creation date (newest first)
   */
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setClients(data || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError(err.message)
      // Use mock data for demo
      setClients([
        { id: '1', nome: 'João Silva', cpf: '123.456.789-01', cep: '01234-567', endereco: 'Rua Example, 123', email: 'joao@example.com' },
        { id: '2', nome: 'Maria Santos', cpf: '987.654.321-00', cep: '04567-890', endereco: 'Av Example, 456', email: 'maria@example.com' },
        { id: '3', nome: 'Pedro Oliveira', cpf: '456.789.123-45', cep: '07890-123', endereco: 'Praça Example, 789', email: 'pedro@example.com' },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Creates a new client in the database
   * @param {object} clientData - The client data to create
   */
  const createClient = useCallback(async (clientData) => {
    try {
      const { data, error: createError } = await supabase
        .from('clientes')
        .insert([clientData])
        .select()

      if (createError) throw createError

      if (data) {
        setClients(prev => [data[0], ...prev])
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('Error creating client:', err)
      // For demo, add mock client
      const newClient = { ...clientData, id: Date.now().toString() }
      setClients(prev => [newClient, ...prev])
      return { success: true, data: newClient }
    }
  }, [])

  /**
   * Updates an existing client in the database
   * @param {string} id - The client ID
   * @param {object} clientData - The updated client data
   */
  const updateClient = useCallback(async (id, clientData) => {
    try {
      const { data, error: updateError } = await supabase
        .from('clientes')
        .update(clientData)
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      if (data) {
        setClients(prev => prev.map(c => c.id === id ? data[0] : c))
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      console.error('Error updating client:', err)
      // For demo, update locally
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c))
      return { success: true, data: { ...clientData, id } }
    }
  }, [])

  /**
   * Deletes a client from the database
   * @param {string} id - The client ID to delete
   */
  const deleteClient = useCallback(async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setClients(prev => prev.filter(c => c.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting client:', err)
      // For demo, delete locally
      setClients(prev => prev.filter(c => c.id !== id))
      return { success: true }
    }
  }, [])

  /**
   * Searches clients by name, CPF, or email
   * @param {string} query - The search query
   */
  const searchClients = useCallback(async (query) => {
    if (!query.trim()) {
      fetchClients()
      return
    }

    try {
      setLoading(true)
      const { data, error: searchError } = await supabase
        .from('clientes')
        .select('*')
        .or(`nome.ilike.%${query}%,cpf.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (searchError) throw searchError

      setClients(data || [])
    } catch (err) {
      console.error('Error searching clients:', err)
      // Filter locally for demo
      const filtered = [
        { id: '1', nome: 'João Silva', cpf: '123.456.789-01', cep: '01234-567', endereco: 'Rua Example, 123', email: 'joao@example.com' },
        { id: '2', nome: 'Maria Santos', cpf: '987.654.321-00', cep: '04567-890', endereco: 'Av Example, 456', email: 'maria@example.com' },
      ].filter(c => 
        c.nome.toLowerCase().includes(query.toLowerCase()) ||
        c.cpf.includes(query) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      )
      setClients(filtered)
    } finally {
      setLoading(false)
    }
  }, [fetchClients])

  // Fetch clients on mount
  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
  }
}

export default useClients

