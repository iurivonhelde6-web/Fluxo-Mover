import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { Header } from '../components/layout'
import { SummaryCards, TrendChart, MonthlyChart, CategoryChart, IncomeChart, RecentTransactions } from '../components/dashboard'
import { DashboardSkeleton } from '../components/ui'

/**
 * Dashboard Page Component
 * 
 * The main dashboard page displaying financial overview, charts, and recent transactions.
 */
const Dashboard = () => {
  const { transactions, loading, summary, transactionsByCategory, transactionsByMonth } = useTransactions()

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard"
        subtitle="Visão geral das suas finanças"
      />
      
      <main className="p-4 lg:p-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards summary={summary} />
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Tendência de Entradas e Saídas
                </h3>
                <TrendChart data={transactionsByMonth} />
              </div>

              {/* Monthly Comparison Chart */}
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Comparativo Mensal
                </h3>
                <MonthlyChart data={transactionsByMonth} />
              </div>
            </div>

            {/* Category Charts and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Expenses by Category */}
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Despesas por Categoria
                </h3>
                <CategoryChart data={transactionsByCategory} />
              </div>

              {/* Income by Category */}
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Receitas por Categoria
                </h3>
                <IncomeChart data={transactionsByCategory} />
              </div>

              {/* Recent Transactions */}
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Transações Recentes
                </h3>
                <RecentTransactions transactions={transactions} maxItems={6} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

