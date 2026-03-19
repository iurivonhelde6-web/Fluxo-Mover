import React from 'react'
import { useTransactions } from '../hooks/useTransactions' // Usando os dados da pedidos_mover
import { Header } from '../components/layout'
import { ClientList } from '../components/clients'
import { TableSkeleton } from '../components/ui'

const Clients = ({ toast }) => {
  // Buscamos as transações pois elas contêm os nomes dos clientes
  const { transactions, loading, error, deleteTransaction } = useTransactions()

  // Como a tabela pedidos_mover tem várias linhas para o mesmo cliente, 
  // vamos criar uma lista de clientes únicos para não repetir nomes na tela.
  const uniqueClients = React.useMemo(() => {
    if (!transactions) return []
    
    const seen = new Set()
    return transactions.filter(t => {
      if (!t.cliente_info || seen.has(t.cliente_info)) return false
      seen.add(t.cliente_info)
      return true
    })
  }, [transactions])

  const handleDelete = async (id) => {
    const result = await deleteTransaction(id)
    if (result.success) {
      toast?.success('Cliente removido da visualização!')
    } else {
      toast?.error('Erro ao remover: ' + result.error)
    }
    return result
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Clientes" 
        subtitle="Gerencie seus clientes e cadastros" 
      />
      
      <main className="p-4 lg:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Erro ao carregar dados</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <TableSkeleton columns={5} rows={10} />
        ) : (
          <ClientList 
            clients={uniqueClients} 
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  )
}

export default Clients
