import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const SideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const { isDark } = useTheme()
  
  const navigationItems = [
    { name: 'Home', path: '/dashboard',},
    { name: 'Library', path: '/library',},
    { name: 'Wish Lists', path: '/wish-lists',},
    { name: 'My Reading', path: '/my-reading',},
    { name: 'Settings', path: '/settings',},
    ...(isAdmin() ? [{ name: 'Admin', path: '/admin' }] : []),
    { name: 'Log Out', path: '/logout',}
  ]

  const handleNavigation = (item) => {
    if (item.name === 'Log Out') {
      logout()
      // Force page reload to ensure clean logout
      window.location.href = '/signin'
      return
    }
    navigate(item.path)
    // Close mobile menu after navigation
    if (onClose) onClose()
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 sm:w-72 lg:w-80 
        h-screen bg-slate-900 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 
        text-white flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* User Profile Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user?.name || 'User'}</h3>
            <p className="text-indigo-200 text-sm capitalize">{user?.role || 'Member'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-6 overflow-y-auto">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-md'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    </>
  )
}

export default SideBar