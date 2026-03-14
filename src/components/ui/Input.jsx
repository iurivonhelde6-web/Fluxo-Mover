import React, { forwardRef } from 'react'

/**
 * Input Component
 * 
 * A versatile input component with label, error handling, and icon support.
 * Supports different input types and visual states.
 */
const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  type = 'text',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`
            w-full px-3 py-2 text-sm bg-white border rounded-md transition-all duration-200
            placeholder:text-stone-400
            focus:outline-none focus:ring-2 
            disabled:bg-stone-100 disabled:cursor-not-allowed
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-stone-300 focus:ring-amber-500/50 focus:border-amber-500'
            }
            ${className}
          `}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon size={18} />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

