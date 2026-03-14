/**
 * Formatting Utilities
 * 
 * Contains functions for formatting data for display.
 * Includes currency, dates, CPF, and text formatters.
 */

/**
 * Formats a CPF number with mask
 * 
 * @param {string} cpf - The CPF to format (only digits)
 * @returns {string} - Formatted CPF (xxx.xxx.xxx-xx)
 */
export const formatCPF = (cpf) => {
  if (!cpf) return ''
  
  // Remove non-digits
  const digits = cpf.replace(/\D/g, '')
  
  if (digits.length === 0) return ''
  
  // Apply mask
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

/**
 * Removes CPF mask
 * 
 * @param {string} cpf - The formatted CPF
 * @returns {string} - CPF with only digits
 */
export const unformatCPF = (cpf) => {
  if (!cpf) return ''
  return cpf.replace(/\D/g, '')
}

/**
 * Formats a number as Brazilian Real currency
 * 
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted currency string (R$ 1.234,56)
 */
export const formatCurrency = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  
  if (isNaN(numValue)) {
    return 'R$ 0,00'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

/**
 * Formats a number with thousand separators
 * 
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted number (1.234)
 */
export const formatNumber = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  
  if (isNaN(numValue)) {
    return '0'
  }
  
  return new Intl.NumberFormat('pt-BR').format(numValue)
}

/**
 * Formats a date string to Brazilian format
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date (dd/MM/yyyy)
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj)
}

/**
 * Formats a date string to Brazilian format with time
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date with time (dd/MM/yyyy HH:mm)
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

/**
 * Formats a date for input[type="date"]
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date (yyyy-MM-dd)
 */
export const formatDateForInput = (date) => {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  return dateObj.toISOString().split('T')[0]
}

/**
 * Formats a transaction type for display
 * 
 * @param {string} type - The transaction type (entrada/saida)
 * @returns {string} - Formatted type (Entrada/Saída)
 */
export const formatTransactionType = (type) => {
  const types = {
    'entrada': 'Entrada',
    'saida': 'Saída'
  }
  return types[type] || type
}

/**
 * Gets the CSS class for transaction type
 * 
 * @param {string} type - The transaction type
 * @returns {string} - CSS class name
 */
export const getTransactionTypeClass = (type) => {
  const classes = {
    'entrada': 'text-sage-700 bg-sage-50',
    'saida': 'text-red-700 bg-red-50'
  }
  return classes[type] || ''
}

/**
 * Gets the icon name for transaction type
 * 
 * @param {string} type - The transaction type
 * @returns {string} - Icon name
 */
export const getTransactionTypeIcon = (type) => {
  return type === 'entrada' ? 'ArrowDownLeft' : 'ArrowUpRight'
}

/**
 * Formats client name for display
 * 
 * @param {string} name - The client name
 * @returns {string} - Formatted name (uppercase)
 */
export const formatClientName = (name) => {
  if (!name) return ''
  return name.toUpperCase()
}

/**
 * Truncates text to a maximum length
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Formats a percentage value
 * 
 * @param {number} value - The value (0-100)
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  
  if (isNaN(numValue)) {
    return '0%'
  }
  
  return `${numValue.toFixed(1)}%`
}

/**
 * Calculates the difference between two dates in days
 * 
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} - Number of days difference
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1)
  const d2 = date2 instanceof Date ? date2 : new Date(date2)
  
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Gets the month name in Portuguese
 * 
 * @param {number} month - Month number (0-11)
 * @returns {string} - Month name
 */
export const getMonthName = (month) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return months[month] || ''
}

/**
 * Groups an array of objects by a key
 * 
 * @param {Array} array - The array to group
 * @param {string} key - The key to group by
 * @returns {object} - Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

/**
 * Calculates the sum of an array of numbers
 * 
 * @param {Array} array - The array of numbers
 * @returns {number} - Sum of all numbers
 */
export const sumArray = (array) => {
  return array.reduce((sum, num) => sum + (parseFloat(num) || 0), 0)
}

/**
 * Gets the current date in Brazilian format
 * 
 * @returns {string} - Current date (dd/MM/yyyy)
 */
export const getCurrentDate = () => {
  return formatDate(new Date())
}

/**
 * Gets the first day of the current month
 * 
 * @returns {Date} - First day of month
 */
export const getFirstDayOfMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Gets the last day of the current month
 * 
 * @returns {Date} - Last day of month
 */
export const getLastDayOfMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
}

