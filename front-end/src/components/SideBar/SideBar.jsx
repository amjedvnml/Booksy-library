import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const SideBar = ({ isOpen, onClose, isCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()
  const { isDark } = useTheme()
  
  const getIcon = (name) => {
    const icons = {
      'Home': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      'Library': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      'Wish Lists': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      'My Reading': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      'Settings': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'Admin': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'Log Out': (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
    return icons[name] || null
  }

  const mainNavigationItems = [
    { name: 'Home', path: '/dashboard'},
    { name: 'Library', path: '/library'},
    { name: 'My Reading', path: '/my-reading'},
    { name: 'Wish Lists', path: '/wish-lists'},
    ...(isAdmin() ? [{ name: 'Admin', path: '/admin' }] : []),
  ]

  const bottomNavigationItems = [
    { name: 'Settings', path: '/settings'},
    { name: 'Log Out', path: '/logout'}
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
        h-screen bg-slate-900 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 
        text-white flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20 lg:w-20' : 'w-64 sm:w-72 lg:w-80'}
      `}>
      {/* User Profile Section */}
      <div className={`p-6 border-b border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-2' : 'space-x-4'}`}>
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div>
              <h3 className="font-semibold text-lg">{user?.name || 'User'}</h3>
              <p className="text-indigo-200 text-sm capitalize">{user?.role || 'Member'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Menu - Center */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-6' : 'px-4 py-6'}`}>
        <nav className="space-y-1">
          {mainNavigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              title={isCollapsed ? item.name : ''}
              className={`w-full flex items-center rounded-lg text-left transition-all duration-200 group ${
                isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-3'
              } ${
                isActive(item.path)
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="flex-shrink-0">
                {getIcon(item.name)}
              </span>
              {!isCollapsed && (
                <span className="font-medium text-[15px]">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation - Settings & Logout */}
      <div className={`border-t border-white/10 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
        <nav className="space-y-1">
          {bottomNavigationItems.map((item) => {
            const isLogout = item.name === 'Log Out'
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                title={isCollapsed ? item.name : ''}
                className={`w-full flex items-center rounded-lg text-left transition-all duration-200 group ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-3'
                } ${
                  isActive(item.path)
                    ? 'bg-white/15 text-white shadow-md'
                    : isLogout 
                      ? 'text-red-300 hover:text-white hover:bg-red-500/20' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="flex-shrink-0">
                  {getIcon(item.name)}
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-[15px]">{item.name}</span>
                )}
              </button>
            )
          })}
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