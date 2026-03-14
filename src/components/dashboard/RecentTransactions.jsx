import React from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate, formatTransactionType, getTransactionTypeClass } from '../../lib/formatters'

/**
 * RecentTransactions Component
 * 
 * Displays the most recent transactions in a compact list format.
 */
const RecentTransactions = ({ transactions, maxItems = 5 }) => {
  // Get the most recent transactions
  const recentTransactions = transactions.slice(0, maxItems)

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <p>Nenhuma transação recente</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {recentTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getTransactionTypeClass(transaction.tipo)}`}>
              {transaction.tipo === 'entrada' ? (
                <ArrowDownLeft size={16} />
              ) : (
                <ArrowUpRight size={16} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-800">
                {transaction.categoria}
              </p>
              <p className="text-xs text-stone-500">
                {transaction.clientes?.nome || 'Cliente'} • {formatDate(transaction.data)}
              </p>
            </div>
          </div>
          <div className={`text-sm font-medium ${
            transaction.tipo === 'entrada' ? 'text-sage-700' : 'text-red-700'
          }`}>
            {transaction.tipo === 'saida' ? '-' : '+'}{formatCurrency(transaction.valor)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentTransactions

