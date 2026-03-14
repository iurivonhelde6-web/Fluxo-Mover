import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout'
import { Dashboard, Clients, Transactions } from './pages'
import { useToast } from './components/ui/Toast'

/**
 * App Component
 * 
 * Main application component with routing and layout.
 * Wraps all pages with the main layout and handles authentication state.
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const { toasts, success, error, warning, info, removeToast } = useToast()

  // Toast helper functions to pass to pages
  const toast = {
    success,
    error,
    warning,
    info,
  }

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              onLogout={handleLogout}
              isAuthenticated={isAuthenticated}
              toasts={toasts}
              onRemoveToast={removeToast}
            />
          }
        >
          <Route index element={<Dashboard toast={toast} />} />
          <Route path="clientes" element={<Clients toast={toast} />} />
          <Route path="transacoes" element={<Transactions toast={toast} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

