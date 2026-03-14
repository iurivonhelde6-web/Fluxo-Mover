import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react'

/**
 * Toast Component
 * 
 * A notification component that displays success, error, warning, and info messages.
 * Auto-dismisses after a configurable duration.
 */
const Toast = ({
  type = 'info',
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [isExiting, setIsExiting] = useState(false)

  const icons = {
    success: <CheckCircle className="text-sage-600" size={20} />,
    error: <XCircle className="text-red-600" size={20} />,
    warning: <AlertCircle className="text-amber-600" size={20} />,
    info: <Info className="text-blue-600" size={20} />,
  }

  const bgColors = {
    success: 'bg-sage-50 border-sage-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  if (!isVisible) return null

  return (
    <div
      className={`
        fixed top-4 right-4 z-[100] max-w-sm
        flex items-start gap-3 p-4 
        border rounded-lg shadow-lg
        ${bgColors[type]}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
      role="alert"
    >
      {icons[type]}
      <p className="flex-1 text-sm text-stone-700">{message}</p>
      <button
        onClick={handleClose}
        className="text-stone-400 hover:text-stone-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

/**
 * Toast Container Component
 * 
 * Manages multiple toast notifications.
 */
export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

/**
 * useToast Hook
 * 
 * A custom hook for managing toast notifications.
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id, isVisible: true }])
    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const success = (message) => {
    return addToast({ type: 'success', message, duration: 5000 })
  }

  const error = (message) => {
    return addToast({ type: 'error', message, duration: 7000 })
  }

  const warning = (message) => {
    return addToast({ type: 'warning', message, duration: 5000 })
  }

  const info = (message) => {
    return addToast({ type: 'info', message, duration: 5000 })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}

export default Toast

