import React, { useState, useMemo } from 'react'
import { Edit, Trash2, Plus, ArrowDownLeft, Filter } from 'lucide-react'
import { Table, Button, Modal } from '../ui'
import TransactionForm from './TransactionForm'
import { formatCurrency } from '../../lib/formatters'

const TransactionList = ({
  transactions = [],
  clients = [],
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

  // ✅ BLINDAGEM TOTAL DOS DADOS
  const safeTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return []
    return transactions.filter(Boolean)
  }, [transactions])

  const safeClients = useMemo(() => {
    if (!Array.isArray(clients)) return []
    return clients.filter(Boolean)
  }, [clients])

  // ✅ CLIENT OPTIONS SEGURO
  const clientOptions = useMemo(() => [
  { value: '', label: 'Todos os clientes' },
  ...safeClients.map(client => ({
    value: client?.id ?? '', // ✅ CORRETO
    label: client?.cliente_info || 'Sem nome'
  }))
], [safeClients])

  // ✅ COLUNAS SEGURAS
  const columns = [
    {
      key: 'data_entrega',
      header: 'Data',
      render: (value) => value || '-',
    },
    {
      key: 'cliente_info',
      header: 'Cliente',
      render: (value) => value || '-',
    },
  {
  key: 'tipo',
  header: 'Tipo',
  render: (_, row) => {
    const isEntrada = row.tipo === 'entrada'

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isEntrada
            ? 'bg-sage-100 text-sage-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        <ArrowDownLeft size={12} />
        {isEntrada ? 'Entrada' : 'Saída'}
      </span>
    )
  },
},
    {
      key: 'frete',
      header: 'Frete/Categoria',
      render: (value) => (
        <span className="uppercase text-xs font-semibold text-stone-500">
          {value || 'Geral'}
        </span>
      )
    },
    {
      key: 'valor_pago',
      header: 'Valor Pago',
      render: (value) => (
        <span className="font-medium text-sage-700">
          +{formatCurrency(value ?? 0)}
        </span>
      ),
    },
    {
      key: 'id_pedido',
      header: 'Ref.',
      render: (value) => (
        <span className="text-stone-400">
          #{value ?? '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '100px',
      render: (_, row) => {
        if (!row) return null

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(row)
              }}
              className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(row)
              }}
              className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      },
    },
  ]

  const handleEdit = (transaction) => {
    if (!transaction) return
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (transaction) => {
    if (!transaction) return
    setSelectedTransaction(transaction)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (selectedTransaction?.id) {
        await onUpdate?.(selectedTransaction.id, formData)
      } else {
        await onCreate?.(formData)
      }

      setIsModalOpen(false)
      setSelectedTransaction(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction?.id) return

    await onDelete?.(selectedTransaction.id)

    setIsDeleteModalOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filtros
        </Button>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Nova Transação
        </Button>
      </div>

      <Table
        columns={columns}
        data={safeTransactions} // ✅ aqui é CRÍTICO
        loading={loading}
        emptyMessage="Nenhuma transação encontrada no banco de dados."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gerenciar Transação"
      >
        <TransactionForm
          transaction={selectedTransaction}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={submitting}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Deseja excluir o registro de{' '}
            <strong>{selectedTransaction?.cliente_info || '-'}</strong>?
          </p>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TransactionList
