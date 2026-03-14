import React, { useState, useEffect } from 'react'
import { Input, Select, Button } from '../ui'
import { formatCPF, formatCEP, validateCPF, validateCEP, validateEmail } from '../../lib/validations'

/**
 * ClientForm Component
 * 
 * Form for creating and editing clients.
 * Includes CPF and CEP validation with auto-formatting.
 * Integrates with ViaCEP API for address auto-fill.
 */
const ClientForm = ({ client, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cep: '',
    endereco: '',
    email: '',
  })

  const [errors, setErrors] = useState({})
  const [cepLoading, setCepLoading] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (client) {
      setFormData({
        nome: client.nome || '',
        cpf: client.cpf || '',
        cep: client.cep || '',
        endereco: client.endereco || '',
        email: client.email || '',
      })
    }
  }, [client])

  // Handle input changes with formatting
  const handleChange = (e) => {
    const { name, value } = e.target
    
    let formattedValue = value
    
    // Apply formatting for CPF
    if (name === 'cpf') {
      formattedValue = formatCPF(value)
    }
    
    // Apply formatting for CEP
    if (name === 'cep') {
      formattedValue = formatCEP(value)
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }

    // Trigger CEP lookup when CEP is complete
    if (name === 'cep' && value.replace(/[^\d]/g, '').length === 8) {
      fetchAddress(value.replace(/[^\d]/g, ''))
    }
  }

  // Fetch address from ViaCEP API
  const fetchAddress = async (cep) => {
    if (cep.length !== 8) return
    
    setCepLoading(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        const address = `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''} - ${data.uf || ''}`
        setFormData(prev => ({ 
          ...prev, 
          endereco: address.trim().replace(/^, |, $/g, '')
        }))
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    } finally {
      setCepLoading(false)
    }
  }

  // Validate form
  const validate = () => {
    const newErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (formData.cep && !validateCEP(formData.cep)) {
      newErrors.cep = 'CEP inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return

    // Clean CPF and CEP for database
    const cleanData = {
      ...formData,
      cpf: formData.cpf.replace(/[^\d]/g, ''),
      cep: formData.cep.replace(/[^\d]/g, ''),
    }

    onSubmit(cleanData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome Completo"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        error={errors.nome}
        placeholder="Digite o nome completo"
        required
      />

      <Input
        label="CPF"
        name="cpf"
        value={formData.cpf}
        onChange={handleChange}
        error={errors.cpf}
        placeholder="000.000.000-00"
        maxLength={14}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="CEP"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          error={errors.cep}
          placeholder="00000-000"
          maxLength={9}
        />
        <div className="flex items-end">
          {cepLoading && (
            <span className="text-xs text-stone-500 animate-pulse">
              Buscando endereço...
            </span>
          )}
        </div>
      </div>

      <Input
        label="Endereço"
        name="endereco"
        value={formData.endereco}
        onChange={handleChange}
        error={errors.endereco}
        placeholder="Rua, número, bairro, cidade - UF"
      />

      <Input
        label="E-mail"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="email@exemplo.com"
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
          variant="primary"
          loading={loading}
        >
          {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </Button>
      </div>
    </form>
  )
}

export default ClientForm

