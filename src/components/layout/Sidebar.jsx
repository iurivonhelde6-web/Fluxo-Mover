import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Menu, 
  X,
  LogOut,
  Wallet
} from 'lucide-react'

/**
 * Sidebar Component
 * 
 * Navigation sidebar with glassmorphism effect, responsive design,
 * and active state indicators.
 */
const Sidebar = ({ onLogout, isAuthenticated }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clientes', icon: Users, label: 'Clientes' },
    { path: '/transacoes', icon: ArrowLeftRight, label: 'Transações' },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-stone-700">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-700 text-white">
          <Wallet size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white font-heading">Mover Fluxo</h1>
          <p className="text-xs text-stone-400">Gestão Financeira</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen(false)}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg 
              transition-all duration-200
              ${isActive(item.path)
                ? 'bg-amber-700/20 text-amber-500 border-l-2 border-amber-500'
                : 'text-stone-400 hover:text-white hover:bg-stone-700/50'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-stone-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg 
                   text-stone-400 hover:text-white hover:bg-stone-700/50 
                   transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg 
                 bg-stone-800 text-white shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className={`
        hidden lg:flex flex-col
        w-64 h-screen fixed left-0 top-0 z-30
        bg-stone-800 border-r border-stone-700
      `}>
        <NavContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={`
        lg:hidden fixed inset-y-0 left-0 z-40
        w-64 transform transition-transform duration-300
        bg-stone-800 border-r border-stone-700
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <NavContent />
      </aside>
    </>
  )
}

export default Sidebar

