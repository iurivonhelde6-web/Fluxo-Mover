/**
 * Validation Utilities
 * 
 * Contains validation functions for forms and data integrity.
 * Includes CPF, CEP, email, and general field validations.
 */

/**
 * Validates a Brazilian CPF number
 * CPF consists of 11 digits, where the last two are check digits
 * 
 * @param {string} cpf - The CPF string to validate (can include dots and dash)
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCPF = (cpf) => {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/[^\d]/g, '')
  
  // Check if it has 11 digits
  if (cleanCPF.length !== 11) {
    return false
  }
  
  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }
  
  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i)
  }
  let remainder = sum % 11
  const checkDigit1 = remainder < 2 ? 0 : 11 - remainder
  
  if (parseInt(cleanCPF[9]) !== checkDigit1) {
    return false
  }
  
  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i)
  }
  remainder = sum % 11
  const checkDigit2 = remainder < 2 ? 0 : 11 - remainder
  
  if (parseInt(cleanCPF[10]) !== checkDigit2) {
    return false
  }
  
  return true
}

/**
 * Formats a CPF string with mask
 * Transforms 12345678901 to 123.456.789-01
 * 
 * @param {string} cpf - The CPF to format
 * @returns {string} - Formatted CPF
 */
export const formatCPF = (cpf) => {
  const cleanCPF = cpf.replace(/[^\d]/g, '')
  
  if (cleanCPF.length <= 3) return cleanCPF
  if (cleanCPF.length <= 6) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`
  if (cleanCPF.length <= 9) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`
  return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`
}

/**
 * Formats a CEP string with mask
 * Transforms 12345678 to 12345-678
 * 
 * @param {string} cep - The CEP to format
 * @returns {string} - Formatted CEP
 */
export const formatCEP = (cep) => {
  const cleanCEP = cep.replace(/[^\d]/g, '')
  
  if (cleanCEP.length <= 5) return cleanCEP
  return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5, 8)}`
}

/**
 * Validates a Brazilian CEP
 * CEP consists of 8 digits (XXXXX-XXX)
 * 
 * @param {string} cep - The CEP string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCEP = (cep) => {
  const cleanCEP = cep.replace(/[^\d]/g, '')
  return cleanCEP.length === 8
}

/**
 * Validates an email address
 * 
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a required field
 * 
 * @param {any} value - The value to check
 * @returns {boolean} - True if value exists and is not empty
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

/**
 * Validates a monetary value
 * Must be a positive number
 * 
 * @param {string|number} value - The value to validate
 * @returns {boolean} - True if valid positive number
 */
export const validateMonetaryValue = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  return !isNaN(numValue) && numValue > 0
}

/**
 * Validates a date
 * 
 * @param {string} date - The date string to validate
 * @returns {boolean} - True if valid date
 */
export const validateDate = (date) => {
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

/**
 * Validates transaction type
 * 
 * @param {string} type - The type to validate
 * @returns {boolean} - True if 'entrada' or 'saida'
 */
export const validateTransactionType = (type) => {
  return type === 'entrada' || type === 'saida'
}

/**
 * Validates a category
 * 
 * @param {string} category - The category to validate
 * @returns {boolean} - True if category is in the allowed list
 */
export const validateCategory = (category) => {
  const allowedCategories = [
    'Aluguel',
    'Vendas',
    'Serviços',
    'Salário',
    'Fornecimento',
    'Manutenção',
    'Outros'
  ]
  return allowedCategories.includes(category)
}

/**
 * Creates a validation error object
 * 
 * @param {string} field - The field name
 * @param {string} message - The error message
 * @returns {object} - Validation error object
 */
export const createValidationError = (field, message) => ({
  field,
  message
})

/**
 * Validates client form data
 * 
 * @param {object} data - The client form data
 * @returns {object} - Object with isValid boolean and errors array
 */
export const validateClientForm = (data) => {
  const errors = []
  
  if (!validateRequired(data.nome)) {
    errors.push(createValidationError('nome', 'Nome é obrigatório'))
  }
  
  if (!validateRequired(data.cpf)) {
    errors.push(createValidationError('cpf', 'CPF é obrigatório'))
  } else if (!validateCPF(data.cpf)) {
    errors.push(createValidationError('cpf', 'CPF inválido'))
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.push(createValidationError('email', 'E-mail inválido'))
  }
  
  if (data.cep && !validateCEP(data.cep)) {
    errors.push(createValidationError('cep', 'CEP inválido'))
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates transaction form data
 * 
 * @param {object} data - The transaction form data
 * @returns {object} - Object with isValid boolean and errors array
 */
export const validateTransactionForm = (data) => {
  const errors = []
  
  if (!validateRequired(data.cliente_id)) {
    errors.push(createValidationError('cliente_id', 'Cliente é obrigatório'))
  }
  
  if (!validateRequired(data.tipo)) {
    errors.push(createValidationError('tipo', 'Tipo de transação é obrigatório'))
  } else if (!validateTransactionType(data.tipo)) {
    errors.push(createValidationError('tipo', 'Tipo de transação inválido'))
  }
  
  if (!validateRequired(data.valor)) {
    errors.push(createValidationError('valor', 'Valor é obrigatório'))
  } else if (!validateMonetaryValue(data.valor)) {
    errors.push(createValidationError('valor', 'Valor deve ser um número positivo'))
  }
  
  if (!validateRequired(data.categoria)) {
    errors.push(createValidationError('categoria', 'Categoria é obrigatória'))
  } else if (!validateCategory(data.categoria)) {
    errors.push(createValidationError('categoria', 'Categoria inválida'))
  }
  
  if (!validateRequired(data.data)) {
    errors.push(createValidationError('data', 'Data é obrigatória'))
  } else if (!validateDate(data.data)) {
    errors.push(createValidationError('data', 'Data inválida'))
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Export constants for categories and transaction types
export const TRANSACTION_TYPES = {
  ENTRADA: 'entrada',
  SAIDA: 'saida'
}

export const TRANSACTION_CATEGORIES = [
  'Aluguel',
  'Vendas',
  'Serviços',
  'Salário',
  'Fornecimento',
  'Manutenção',
  'Outros'
]

