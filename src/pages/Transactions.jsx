import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Header } from '../components/layout';
import { TransactionList } from '../components/transactions';
import { TableSkeleton } from '../components/ui';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    error,
    createTransaction
  } = useTransactions();

  // 🔥 Wrapper para tratamento de erro no create
  const handleCreate = async (data) => {
    const result = await createTransaction(data)

    if (!result.success) {
      alert(`Erro ao salvar: ${result.error}`)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="Transações" subtitle="Histórico de pedidos" />
      
      <main className="p-4 lg:p-8">
        
        {/* 🔴 ERRO GLOBAL */}
        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 🔄 LOADING */}
        {loading ? (
          <TableSkeleton />
        ) : (
          <TransactionList 
            key={transactions.length} // 🔥 força atualização segura
            transactions={transactions || []}
            onCreate={handleCreate} // ✅ agora com tratamento
          />
        )}
      </main>
    </div>
  );
};

export default Transactions;
