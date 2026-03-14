import React from 'react'

/**
 * Card Component
 * 
 * A versatile card container with glassmorphism support, hover effects, and padding options.
 */
const Card = ({
  children,
  className = '',
  glass = false,
  hover = true,
  padding = 'md',
  title,
  action,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div
      className={`
        rounded-lg border transition-all duration-200
        ${glass 
          ? 'bg-white/60 backdrop-blur-md border-white/20 shadow-glass hover:shadow-glass-lg' 
          : 'bg-white border-stone-100 shadow-glass hover:shadow-glass-lg'
        }
        ${hover ? 'hover:scale-[1.02] cursor-default' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-stone-800 font-heading">
              {title}
            </h3>
          )}
          {action && (
            <div>{action}</div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card

