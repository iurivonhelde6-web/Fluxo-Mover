import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { ToastContainer } from '../ui/Toast'

/**
 * MainLayout Component
 * 
 * The main application layout that wraps all authenticated pages.
 * Contains the sidebar and the main content area.
 */
const MainLayout = ({ onLogout, isAuthenticated, toasts, onRemoveToast }) => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} isAuthenticated={isAuthenticated} />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <Outlet />
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={onRemoveToast} />
    </div>
  )
}

export default MainLayout

