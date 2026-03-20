import React, { useState, useEffect, useMemo } from 'react'
import { Input, Select, Button } from '../ui'
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '../../lib/validations'
import { formatDateForInput } from '../../lib/formatters'

const TransactionForm = ({
  transaction,
  clients = [], // ✅ proteção
  onSubmit,
  onCancel,
  loading
}) => {

  // ✅ função segura pra data atual
  const getToday = () => {
    return new Date().toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo: '',
    valor: '',
    categoria: '',
    data: getToday(), // ✅ corrigido
    descricao: '',
  })

  const [errors, setErrors] = useState({})

  // ✅ Populate form (SUPER seguro)
  useEffect(() => {
    if (!transaction) return

    setFormData({
      cliente_id: transaction?.cliente_id ?? '',
      tipo: transaction?.tipo ?? '',
      valor: transaction?.valor ?? '',
      categoria: transaction?.categoria ?? '',
      data: typeof transaction?.data === 'string'
        ? transaction.data.includes('T')
          ? transaction.data.split('T')[0]
          : transaction.data
        : getToday(),
      descricao: transaction?.descricao ?? '',
    })

  }, [transaction])

  // ✅ CLIENT OPTIONS SEGURO
  const clientOptions = useMemo(() => {
    if (!Array.isArray(clients)) return []

    return clients
      .filter(Boolean)
      .map(client => ({
        value: client?.id ?? '',
        label: client?.nome || 'Sem nome',
      }))
  }, [clients])

  // Type options
  const typeOptions = [
    { value: TRANSACTION_TYPES.ENTRADA, label: 'Entrada' },
    { value: TRANSACTION_TYPES.SAIDA, label: 'Saída' },
  ]

  // Category options
  const categoryOptions = (TRANSACTION_CATEGORIES || []).map(cat => ({
    value: cat,
    label: cat,
  }))

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.cliente_id) newErrors.cliente_id = 'Cliente é obrigatório'
    if (!formData.tipo) newErrors.tipo = 'Tipo é obrigatório'

    if (!formData.valor) {
      newErrors.valor = 'Valor é obrigatório'
    } else if (isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor inválido'
    }

    if (!formData.categoria) newErrors.categoria = 'Categoria obrigatória'
    if (!formData.data) newErrors.data = 'Data obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const cleanData = {
      ...formData,
      valor: parseFloat(formData.valor),
    }

    onSubmit?.(cleanData)
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
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">

        <Button type="button" variant="secondary" onClick={onCancel}>
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
