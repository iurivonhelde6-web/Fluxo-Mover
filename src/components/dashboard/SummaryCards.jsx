import React from 'react'
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../lib/formatters'

const SummaryCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-100 text-amber-700',
      text: 'text-amber-700',
    },
    sage: {
      bg: 'bg-sage-50',
      icon: 'bg-sage-100 text-sage-700',
      text: 'text-sage-700',
    },
    terracotta: {
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-700',
      text: 'text-red-700',
    },
  }

  const colors = colorClasses[color] || colorClasses.amber

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass hover:shadow-glass-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-stone-500">{title}</span>
        <div className={`p-2 rounded-lg ${colors.icon}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className={`text-2xl font-bold ${colors.text} font-heading`}>
        {formatCurrency(value || 0)} {/* proteção extra */}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp size={14} className={trend >= 0 ? 'text-sage-600' : 'text-red-600'} />
          <span className={`text-xs ${trend >= 0 ? 'text-sage-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}
            {trend.toFixed(1)}% do mês anterior
          </span>
        </div>
      )}
    </div>
  )
}

const SummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Saldo Total"
        value={summary?.saldo}
        icon={Wallet}
        color="amber"
        trend={12.5}
      />

      <SummaryCard
        title="Total de Entradas"
        value={summary?.entradas} // ✅ CORRIGIDO
        icon={ArrowDownLeft}
        color="sage"
        trend={8.2}
      />

      <SummaryCard
        title="Total de Saídas"
        value={summary?.saidas} // ✅ CORRIGIDO
        icon={ArrowUpRight}
        color="terracotta"
        trend={-3.1}
      />
    </div>
  )
}

export default SummaryCards
