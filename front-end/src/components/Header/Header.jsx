import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-4 transition-colors">
      {/* Main Header Row */}
      <div className="flex items-center justify-between mb-6">
        {/* Logo and Library Title */}
        <div className="flex items-center space-x-4">
          <img 
            src="/BooksyLogosCorrect.png" 
            alt="Booksy Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Booksy Library</h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm">Reading Club of Manhattan</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Find author or book name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-slate-800 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <button className="p-2 text-gray-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h0z" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* For You Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">For you</h2>
        <div className="text-sm text-gray-500 dark:text-slate-400">
          Showing personalized recommendations
        </div>
      </div>
    </div>
  )
}

export default Header