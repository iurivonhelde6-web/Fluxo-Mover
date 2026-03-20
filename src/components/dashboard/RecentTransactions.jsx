import React from 'react'
import { ArrowDownLeft } from 'lucide-react'
import { formatCurrency } from '../../lib/formatters'

const RecentTransactions = ({ transactions = [], maxItems = 5 }) => {

  // ✅ garante array válido + remove lixo
  const safeTransactions = Array.isArray(transactions)
    ? transactions.filter(Boolean)
    : []

  const recentTransactions = safeTransactions.slice(0, maxItems)

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <p>Nenhuma transação recente</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {recentTransactions.map((transaction, index) => {
        if (!transaction) return null

        return (
          <div
            key={transaction?.id_pedido ?? index} // ✅ fallback seguro
            className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-3">

              <div className="p-2 rounded-full bg-sage-100 text-sage-700">
                <ArrowDownLeft size={16} />
              </div>

              <div>
                <p className="text-sm font-medium text-stone-800">
                  {transaction?.frete || 'Geral'}
                </p>

                <p className="text-xs text-stone-500 line-clamp-1">
                  {transaction?.cliente_info || 'Cliente não identificado'}{' '}
                  • {transaction?.data_entrega || '-'}
                </p>
              </div>

            </div>

            <div className="text-sm font-medium text-sage-700">
              +{formatCurrency(transaction?.valor_pago ?? 0)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RecentTransactions
