import React from 'react'
import { Search, Bell, User } from 'lucide-react'

/**
 * Header Component
 * 
 * Page header with title, search functionality, and user actions.
 */
const Header = ({ 
  title, 
  subtitle,
  actions,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...'
}) => {
  return (
    <header className="sticky top-0 z-20 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-stone-800 font-heading truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                           focus:border-amber-500 placeholder:text-stone-400"
                />
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            {actions}
            
            {/* Notifications */}
            <button className="relative p-2 text-stone-500 hover:text-stone-700 
                           hover:bg-stone-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 
                           bg-amber-100 text-amber-700 rounded-full">
                <User size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                         focus:border-amber-500 placeholder:text-stone-400"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

