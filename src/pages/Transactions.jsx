import React from 'react'
import { useClients } from '../hooks/useClients'
import { useTransactions } from '../hooks/useTransactions'
import { Header } from '../components/layout'
import { TransactionList } from '../components/transactions'
import { TableSkeleton } from '../components/ui'

const Transactions = ({ toast }) => {
  const { clients, loading: clientsLoading } = useClients()
  const { 
    transactions, 
    loading: transactionsLoading, 
    error,
    filters, 
    setFilters,
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions()

  // CORREÇÃO: Declaramos 'isLoading' apenas uma vez aqui
  const isLoading = clientsLoading || transactionsLoading

  const handleCreate = async (transactionData) => {
    const result = await createTransaction(transactionData)
    if (result.success) toast?.success('Transação registrada com sucesso!')
    else toast?.error('Erro ao registrar transação')
    return result
  }

  const handleUpdate = async (id, transactionData) => {
    const result = await updateTransaction(id, transactionData)
    if (result.success) toast?.success('Transação atualizada com sucesso!')
    else toast?.error('Erro ao atualizar transação')
    return result
  }

  const handleDelete = async (id) => {
    const result = await deleteTransaction(id)
    if (result.success) toast?.success('Transação excluída com sucesso!')
    else toast?.error('Erro ao excluir transação')
    return result
  }

  return (
    <div className="min-h-screen">
      <Header title="Transações" subtitle="Gerencie suas entradas e saídas" />
      
      <main className="p-4 lg:p-8">
        {error && (
          <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-700 text-sm">
            Nota: Alguns dados podem não estar disponíveis no momento.
          </div>
        )}

        {isLoading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <TransactionList
            transactions={transactions || []}
            clients={clients || []}
            loading={isLoading}
            filters={filters || {}}
            setFilters={setFilters}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}

export default Transactions
