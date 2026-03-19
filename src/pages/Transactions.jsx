import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { Header } from '../components/layout'
import { TransactionList } from '../components/transactions'
import { TableSkeleton } from '../components/ui'

const Transactions = () => {
  const { transactions, loading, error } = useTransactions()

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="Transações" subtitle="Histórico de pedidos e pagamentos" />
      <main className="p-4 lg:p-8">
        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        
        {loading ? (
          <TableSkeleton />
        ) : (
          <TransactionList 
            transactions={transactions || []} 
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}

export default Transactions
