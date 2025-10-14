import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const SideBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const { isDark } = useTheme()
  
  const navigationItems = [
    { name: 'Home', path: '/',},
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
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="w-80 h-screen bg-slate-900 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 text-white flex flex-col transition-colors">
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
      <div className="flex-1 p-6">
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
    </div>
  )
}

export default SideBar