import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  theme: {}
})

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('booksy-theme')
      return saved ? JSON.parse(saved) : false
    } catch (error) {
      return false
    }
  })

  useEffect(() => {
    console.log('Theme useEffect triggered, isDark:', isDark)
    localStorage.setItem('booksy-theme', JSON.stringify(isDark))
    if (isDark) {
      document.documentElement.classList.add('dark')
      console.log('Added dark class to html element')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Removed dark class from html element')
    }
    console.log('Current html classes:', document.documentElement.className)
  }, [isDark])

  const toggleTheme = () => {
    console.log('Theme toggle called, current isDark:', isDark)
    const newValue = !isDark
    console.log('Setting new theme value:', newValue)
    setIsDark(newValue)
  }

  const theme = {
    colors: {
      // Primary colors matching the logo
      primary: {
        50: isDark ? '#f0f9ff' : '#f0f4ff',
        100: isDark ? '#e0f2fe' : '#e0e7ff', 
        200: isDark ? '#bae6fd' : '#c7d2fe',
        300: isDark ? '#7dd3fc' : '#a5b4fc',
        400: isDark ? '#38bdf8' : '#818cf8',
        500: isDark ? '#0ea5e9' : '#6366f1', // Main purple from logo
        600: isDark ? '#0284c7' : '#4f46e5',
        700: isDark ? '#0369a1' : '#4338ca',
        800: isDark ? '#075985' : '#3730a3',
        900: isDark ? '#0c4a6e' : '#312e81',
      },
      // Teal accent from logo
      accent: {
        50: isDark ? '#f0fdfa' : '#f0fdfa',
        100: isDark ? '#ccfbf1' : '#ccfbf1',
        200: isDark ? '#99f6e4' : '#99f6e4',
        300: isDark ? '#5eead4' : '#5eead4',
        400: isDark ? '#2dd4bf' : '#2dd4bf', // Main teal from logo
        500: isDark ? '#14b8a6' : '#14b8a6',
        600: isDark ? '#0d9488' : '#0d9488',
        700: isDark ? '#0f766e' : '#0f766e',
        800: isDark ? '#115e59' : '#115e59',
        900: isDark ? '#134e4a' : '#134e4a',
      },
      // Background colors
      background: {
        primary: isDark ? '#0f172a' : '#ffffff',
        secondary: isDark ? '#1e293b' : '#f8fafc',
        tertiary: isDark ? '#334155' : '#f1f5f9',
      },
      // Text colors
      text: {
        primary: isDark ? '#f8fafc' : '#1e293b',
        secondary: isDark ? '#cbd5e1' : '#64748b',
        tertiary: isDark ? '#94a3b8' : '#94a3b8',
      },
      // Border colors
      border: {
        primary: isDark ? '#334155' : '#e2e8f0',
        secondary: isDark ? '#475569' : '#cbd5e1',
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}