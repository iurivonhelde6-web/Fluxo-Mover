import React from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency, formatDate, getTransactionTypeClass } from '../../lib/formatters'

/**
 * RecentTransactions Component - Ajustado para a tabela pedidos_mover
 */
const RecentTransactions = ({ transactions, maxItems = 5 }) => {
  // Pega as transações mais recentes
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
          key={transaction.id_pedido} // Alterado de .id para .id_pedido
          className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Como sua tabela atual só tem entradas (vendas), forçamos o ícone de entrada */}
            <div className={`p-2 rounded-full bg-sage-100 text-sage-700`}>
              <ArrowDownLeft size={16} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-stone-800">
                {/* Alterado de .categoria para .frete (Ex: JADLOG) */}
                {transaction.frete || 'Geral'} 
              </p>
              <p className="text-xs text-stone-500 line-clamp-1">
                {/* Alterado de .clientes.nome para .cliente_info */}
                {transaction.cliente_info || 'Cliente não identificado'} • {transaction.data_entrega}
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-sage-700">
            {/* Alterado de .valor para .valor_pago */}
            +{formatCurrency(transaction.valor_pago || 0)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentTransactions
