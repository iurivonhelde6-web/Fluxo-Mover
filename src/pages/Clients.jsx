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

  // Dentro do return da sua página de Clientes:
<tbody className="divide-y divide-stone-200">
  {customers.map((cliente) => (
    <tr key={cliente.id_pedido} className="hover:bg-stone-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-stone-900">
            {/* Aqui usamos a coluna cliente_info que tem o nome no seu banco */}
            {cliente.cliente_info || 'Sem nome'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
        {/* Se tiver a coluna de contacto/cpf, coloque aqui, senão use frete ou outro dado */}
        {cliente.contato_cliente || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
        {/* Mostra a data do último pedido desse cliente */}
        {cliente.data_entrega}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-sage-600 hover:text-sage-900">Ver Pedidos</button>
      </td>
    </tr>
  ))}
</tbody>
