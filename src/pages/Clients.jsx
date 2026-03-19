import React, { useMemo } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { Header } from '../components/layout'
import { TableSkeleton } from '../components/ui'

const Clients = () => {
  const { transactions, loading, error } = useTransactions()

  // Filtra os clientes para não repetir o nome na lista
  const uniqueClients = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return []
    const seen = new Set()
    return transactions.filter(t => {
      if (!t.cliente_info || seen.has(t.cliente_info)) return false
      seen.add(t.cliente_info)
      return true
    }).map(t => ({
      id: t.id_pedido,
      nome: t.cliente_info,
      ultimo_pedido: t.data_entrega,
      frete_preferencial: t.frete
    }))
  }, [transactions])

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="Clientes" subtitle="Lista de clientes extraída dos pedidos" />
      
      <main className="p-4 lg:p-8">
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">NOME DO CLIENTE</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">ÚLTIMO PEDIDO</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">FRETE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {uniqueClients.length > 0 ? (
                  uniqueClients.map((client) => (
                    <tr key={client.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-stone-900">{client.nome}</td>
                      <td className="px-6 py-4 text-sm text-stone-500">{client.ultimo_pedido}</td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        <span className="px-2 py-1 bg-stone-100 rounded text-xs uppercase">{client.frete_preferencial}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-stone-500">
                      Nenhum cliente encontrado nos registros de pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Clients
