import React, { useState } from 'react'
import { Edit, Trash2, Plus, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react'
import { Table, Button, Modal, Input, Select } from '../ui'
import TransactionForm from './TransactionForm'
import { formatCurrency, formatDate, formatTransactionType, getTransactionTypeClass } from '../../lib/formatters'
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../../lib/validations'

/**
 * TransactionList Component
 * 
 * Displays a list of transactions with filters, CRUD operations, and modals.
 */
const TransactionList = ({ 
  transactions, 
  clients,
  loading, 
  filters,
  setFilters,
  onCreate, 
  onUpdate, 
  onDelete 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Type options
  const typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: TRANSACTION_TYPES.ENTRADA, label: 'Entrada' },
    { value: TRANSACTION_TYPES.SAIDA, label: 'Saída' },
  ]

  // Category options
  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...TRANSACTION_CATEGORIES.map(cat => ({ value: cat, label: cat }))
  ]

  // Client options
  const clientOptions = [
    { value: '', label: 'Todos os clientes' },
    ...clients.map(client => ({ value: client.id, label: client.nome }))
  ]

  // Table columns
  const columns = [
    {
      key: 'data',
      header: 'Data',
      render: (value) => formatDate(value),
    },
    {
      key: 'clientes',
      header: 'Cliente',
      render: (_, row) => row.clientes?.nome || '-',
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeClass(value)}`}>
          {value === 'entrada' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
          {formatTransactionType(value)}
        </span>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoria',
    },
    {
      key: 'valor',
      header: 'Valor',
      render: (value, row) => (
        <span className={`font-medium ${row.tipo === 'entrada' ? 'text-sage-700' : 'text-red-700'}`}>
          {row.tipo === 'saida' ? '-' : '+'}{formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (value) => value || '-',
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '100px',
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

  // Handle create new transaction
  const handleCreate = () => {
    setSelectedTransaction(null)
    setIsModalOpen(true)
  }

  // Handle edit transaction
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  // Handle delete click
  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDeleteModalOpen(true)
  }

  // Handle form submit
  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (selectedTransaction) {
        await onUpdate(selectedTransaction.id, formData)
      } else {
        await onCreate(formData)
      }
      setIsModalOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      console.error('Error saving transaction:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return
    
    try {
      await onDelete(selectedTransaction.id)
      setIsDeleteModalOpen(false)
      setSelectedTransaction(null)
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      tipo: '',
      categoria: '',
      cliente_id: '',
      dataInicio: '',
      dataFim: '',
    })
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
          {(filters.tipo || filters.categoria || filters.cliente_id || filters.dataInicio || filters.dataFim) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Limpar filtros
            </Button>
          )}
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={handleCreate}
        >
          Nova Transação
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              label="Tipo"
              value={filters.tipo}
              onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
              options={typeOptions}
            />
            <Select
              label="Categoria"
              value={filters.categoria}
              onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
              options={categoryOptions}
            />
            <Select
              label="Cliente"
              value={filters.cliente_id}
              onChange={(e) => setFilters(prev => ({ ...prev, cliente_id: e.target.value }))}
              options={clientOptions}
            />
            <Input
              label="Data Início"
              type="date"
              value={filters.dataInicio}
              onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
            />
            <Input
              label="Data Fim"
              type="date"
              value={filters.dataFim}
              onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <Table
        columns={columns}
        data={transactions}
        loading={loading}
        emptyMessage="Nenhuma transação encontrada. Registre sua primeira transação!"
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTransaction(null)
        }}
        title={selectedTransaction ? 'Editar Transação' : 'Nova Transação'}
        size="md"
      >
        <TransactionForm
          transaction={selectedTransaction}
          clients={clients}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedTransaction(null)
          }}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedTransaction(null)
        }}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Tem certeza que deseja excluir esta transação?
          </p>
          {selectedTransaction && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <p className="text-sm">
                <strong>Valor:</strong> {formatCurrency(selectedTransaction.valor)}
              </p>
              <p className="text-sm">
                <strong>Tipo:</strong> {formatTransactionType(selectedTransaction.tipo)}
              </p>
              <p className="text-sm">
                <strong>Data:</strong> {formatDate(selectedTransaction.data)}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setSelectedTransaction(null)
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

export default TransactionList

