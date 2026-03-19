import React, { useMemo } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { Header } from '../components/layout'
import { TableSkeleton } from '../components/ui'

const Clients = () => {
  const { transactions, loading, error } = useTransactions()

  const uniqueClients = useMemo(() => {
    // PROTEÇÃO: Verifica se transactions existe antes de fazer qualquer coisa
    if (!transactions || !Array.isArray(transactions)) return []
    
    const seen = new Set()
    const list = []

    transactions.forEach(t => {
      if (t.cliente_info && !seen.has(t.cliente_info)) {
        seen.add(t.cliente_info)
        list.push({
          id: t.id_pedido || Math.random(),
          nome: t.cliente_info,
          ultimo_pedido: t.data_entrega || 'Sem data',
          frete: t.frete || 'Não informado'
        })
      }
    })
    return list
  }, [transactions])

  if (error) return <div className="p-8 text-red-600">Erro: {error}</div>

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="Clientes" subtitle="Lista de clientes cadastrados" />
      <main className="p-4 lg:p-8">
        {loading ? <TableSkeleton /> : (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Nome</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase">Frete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {uniqueClients.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">{c.nome}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{c.ultimo_pedido}</td>
                    <td className="px-6 py-4 text-sm text-stone-500">{c.frete}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Clients
