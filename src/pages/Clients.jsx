import React from 'react'
import { useClients } from '../hooks/useClients'
import { Header } from '../components/layout'
import { ClientList } from '../components/clients'
import { TableSkeleton } from '../components/ui'

const Clients = ({ toast }) => {
  // Adicionei 'error' aqui para podermos avisar o usuário
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()

  const handleCreate = async (clientData) => {
    const result = await createClient(clientData)
    if (result.success) {
      toast?.success('Cliente cadastrado com sucesso!')
    } else {
      toast?.error('Erro ao cadastrar cliente: ' + (result.error || 'Erro desconhecido'))
    }
    return result
  }

  const handleUpdate = async (id, clientData) => {
    // Proteção caso updateClient não esteja definido no hook
    if (!updateClient) {
      toast?.error('Função de atualização não configurada')
      return { success: false }
    }
    const result = await updateClient(id, clientData)
    if (result.success) {
      toast?.success('Cliente atualizado com sucesso!')
    } else {
      toast?.error('Erro ao atualizar cliente')
    }
    return result
  }

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
        {/* EXIBE MENSAGEM DE ERRO SE A API FALHAR, EM VEZ DE TELA BRANCA */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Erro de Conexão:</strong> {error}. Verifique as chaves do Supabase na Vercel.
          </div>
        )}

        {loading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <ClientList
            // GARANTE que clients seja sempre um array para evitar erro de .map()
            clients={Array.isArray(clients) ? clients : []}
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
