import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Select Component
 * 
 * A dropdown select component with label, error handling, and custom styling.
 */
const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Selecione uma opção',
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 py-2 text-sm bg-white border rounded-md appearance-none
            transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 
            disabled:bg-stone-100 disabled:cursor-not-allowed
            pr-10
            ${error 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-stone-300 focus:ring-amber-500/50 focus:border-amber-500'
            }
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select

