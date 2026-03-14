import React, { useState, useEffect } from 'react'
import { Input, Select, Button } from '../ui'
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../../lib/validations'
import { formatDateForInput } from '../../lib/formatters'

/**
 * TransactionForm Component
 * 
 * Form for creating and editing transactions.
 * Links transactions to clients and includes type/category selection.
 */
const TransactionForm = ({ 
  transaction, 
  clients, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo: '',
    valor: '',
    categoria: '',
    data: formatDateForInput(new Date()),
    descricao: '',
  })

  const [errors, setErrors] = useState({})

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        cliente_id: transaction.cliente_id || '',
        tipo: transaction.tipo || '',
        valor: transaction.valor || '',
        categoria: transaction.categoria || '',
        data: transaction.data || formatDateForInput(new Date()),
        descricao: transaction.descricao || '',
      })
    }
  }, [transaction])

  // Client options for select
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.nome,
  }))

  // Type options
  const typeOptions = [
    { value: TRANSACTION_TYPES.ENTRADA, label: 'Entrada' },
    { value: TRANSACTION_TYPES.SAIDA, label: 'Saída' },
  ]

  // Category options
  const categoryOptions = TRANSACTION_CATEGORIES.map(cat => ({
    value: cat,
    label: cat,
  }))

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Validate form
  const validate = () => {
    const newErrors = {}

    if (!formData.cliente_id) {
      newErrors.cliente_id = 'Cliente é obrigatório'
    }

    if (!formData.tipo) {
      newErrors.tipo = 'Tipo de transação é obrigatório'
    }

    if (!formData.valor) {
      newErrors.valor = 'Valor é obrigatório'
    } else if (parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return

    const cleanData = {
      ...formData,
      valor: parseFloat(formData.valor),
    }

    onSubmit(cleanData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Cliente"
        name="cliente_id"
        value={formData.cliente_id}
        onChange={(e) => handleSelectChange('cliente_id', e.target.value)}
        options={clientOptions}
        error={errors.cliente_id}
        placeholder="Selecione um cliente"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo"
          name="tipo"
          value={formData.tipo}
          onChange={(e) => handleSelectChange('tipo', e.target.value)}
          options={typeOptions}
          error={errors.tipo}
          placeholder="Entrada/Saída"
          required
        />
        
        <Input
          label="Valor"
          name="valor"
          type="number"
          step="0.01"
          min="0"
          value={formData.valor}
          onChange={handleChange}
          error={errors.valor}
          placeholder="0,00"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Categoria"
          name="categoria"
          value={formData.categoria}
          onChange={(e) => handleSelectChange('categoria', e.target.value)}
          options={categoryOptions}
          error={errors.categoria}
          placeholder="Selecione uma categoria"
          required
        />

        <Input
          label="Data"
          name="data"
          type="date"
          value={formData.data}
          onChange={handleChange}
          error={errors.data}
          required
        />
      </div>

      <Input
        label="Descrição"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        error={errors.descricao}
        placeholder="Descrição opcional da transação"
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant={formData.tipo === 'entrada' ? 'success' : 'danger'}
          loading={loading}
        >
          {transaction ? 'Salvar Alterações' : 'Registrar Transação'}
        </Button>
      </div>
    </form>
  )
}

export default TransactionForm

