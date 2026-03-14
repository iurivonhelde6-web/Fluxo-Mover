import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and different visual styles.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-amber-700 text-white hover:bg-amber-600 focus:ring-amber-500 active:bg-amber-800',
    secondary: 'bg-transparent text-stone-700 border border-stone-300 hover:bg-stone-100 focus:ring-stone-400',
    danger: 'bg-red-700 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-800',
    ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 focus:ring-stone-400',
    success: 'bg-sage-700 text-white hover:bg-sage-600 focus:ring-sage-500 active:bg-sage-800',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={iconSizes[size]} />
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={iconSizes[size]} />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === 'right' ? (
        <Icon size={iconSizes[size]} />
      ) : null}
    </button>
  )
}

export default Button

