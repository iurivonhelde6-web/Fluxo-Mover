import React from 'react'
import { useClients } from '../hooks/useClients'
import { Header } from '../components/layout'
import { ClientList } from '../components/clients'
import { TableSkeleton } from '../components/ui'

/**
 * Clients Page Component
 * 
 * Page for managing clients with CRUD operations.
 */
const Clients = ({ toast }) => {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients()

  // Handle create client
  const handleCreate = async (clientData) => {
    const result = await createClient(clientData)
    if (result.success) {
      toast?.success('Cliente cadastrado com sucesso!')
    } else {
      toast?.error('Erro ao cadastrar cliente')
    }
    return result
  }

  // Handle update client
  const handleUpdate = async (id, clientData) => {
    const result = await updateClient(id, clientData)
    if (result.success) {
      toast?.success('Cliente atualizado com sucesso!')
    } else {
      toast?.error('Erro ao atualizar cliente')
    }
    return result
  }

  // Handle delete client
  const handleDelete = async (id) => {
    const result = await deleteClient(id)
    if (result.success) {
      toast?.success('Cliente excluído com sucesso!')
    } else {
      toast?.error('Erro ao excluir cliente')
    }
    return result
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Clientes"
        subtitle="Gerencie seus clientes e cadastros"
      />
      
      <main className="p-4 lg:p-8">
        {loading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <ClientList
            clients={clients}
            loading={loading}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}

export default Clients

