import React, { useState } from 'react'
import { Edit, Trash2, UserPlus, Search } from 'lucide-react'
import { Table, Button, Modal, Input } from '../ui'
import ClientForm from './ClientForm'
import { formatCPF, formatDate } from '../../lib/formatters'

/**
 * ClientList Component
 * 
 * Displays a list of clients with search, CRUD operations, and modals.
 */
const ClientList = ({ 
  clients, 
  loading, 
  onCreate, 
  onUpdate, 
  onDelete 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.cpf?.includes(searchQuery) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Table columns
  const columns = [
    {
      key: 'nome',
      header: 'Nome',
      render: (value) => (
        <span className="font-medium text-stone-800">{value}</span>
      ),
    },
    {
      key: 'cpf',
      header: 'CPF',
      render: (value) => formatCPF(value),
    },
    {
      key: 'email',
      header: 'E-mail',
    },
    {
      key: 'cep',
      header: 'CEP',
      render: (value) => value ? value.replace(/^(\d{5})(\d{3})$/, '$1-$2') : '-',
    },
    {
      key: 'created_at',
      header: 'Cadastro',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '120px',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row)
            }}
            className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteClick(row)
            }}
            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  // Handle create new client
  const handleCreate = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  // Handle edit client
  const handleEdit = (client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  // Handle delete click
  const handleDeleteClick = (client) => {
    setSelectedClient(client)
    setIsDeleteModalOpen(true)
  }

  // Handle form submit
  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (selectedClient) {
        await onUpdate(selectedClient.id, formData)
      } else {
        await onCreate(formData)
      }
      setIsModalOpen(false)
      setSelectedClient(null)
    } catch (error) {
      console.error('Error saving client:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedClient) return
    
    try {
      await onDelete(selectedClient.id)
      setIsDeleteModalOpen(false)
      setSelectedClient(null)
    } catch (error) {
      console.error('Error deleting client:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                     focus:border-amber-500 placeholder:text-stone-400"
          />
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={handleCreate}
        >
          Novo Cliente
        </Button>
      </div>

      {/* Clients Table */}
      <Table
        columns={columns}
        data={filteredClients}
        loading={loading}
        emptyMessage="Nenhum cliente encontrado. Cadastre seu primeiro cliente!"
        onRowClick={handleEdit}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedClient(null)
        }}
        title={selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
        size="md"
      >
        <ClientForm
          client={selectedClient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedClient(null)
          }}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedClient(null)
        }}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Tem certeza que deseja excluir o cliente <strong>{selectedClient?.nome}</strong>?
          </p>
          <p className="text-sm text-stone-500">
            Esta ação não pode ser desfeita e todas as transações associadas a este cliente também serão excluídas.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setSelectedClient(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ClientList

