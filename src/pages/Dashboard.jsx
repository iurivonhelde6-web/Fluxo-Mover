import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { Header } from '../components/layout'
import { SummaryCards, TrendChart, MonthlyChart, CategoryChart, IncomeChart, RecentTransactions } from '../components/dashboard'
import { DashboardSkeleton } from '../components/ui'

const Dashboard = () => {
  // Adicionei 'error' para diagnóstico visual se algo falhar no banco
  const { transactions, loading, error, summary, transactionsByCategory, transactionsByMonth } = useTransactions()

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard"
        subtitle="Visão geral das suas finanças"
      />
      
      <main className="p-4 lg:p-8">
        {/* Banner de Erro: Aparece se houver erro no banco, mas não trava a tela */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Aviso de Conexão</p>
            <p className="text-sm">Não foi possível carregar alguns dados: {error}</p>
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Summary Cards: Protegido com objeto vazio caso summary seja undefined */}
            <SummaryCards summary={summary || { saldo: 0, receitas: 0, despesas: 0 }} />
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Tendência de Entradas e Saídas
                </h3>
                {/* Proteção: garante array vazio para o gráfico não quebrar */}
                <TrendChart data={transactionsByMonth || []} />
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Comparativo Mensal
                </h3>
                <MonthlyChart data={transactionsByMonth || []} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Despesas por Categoria
                </h3>
                <CategoryChart data={transactionsByCategory || []} />
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Receitas por Categoria
                </h3>
                <IncomeChart data={transactionsByCategory || []} />
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-glass">
                <h3 className="text-lg font-semibold text-stone-800 font-heading mb-4">
                  Transações Recentes
                </h3>
                {/* Proteção CRÍTICA: impede o erro de .map() no RecentTransactions */}
                <RecentTransactions transactions={transactions || []} maxItems={6} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
