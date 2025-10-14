import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const SignIn = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check for admin credentials
      if (formData.email === 'admin@booksy.com' && formData.password === 'admin123') {
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userName', 'Admin User')
        // Force page reload to ensure auth context updates
        window.location.href = '/admin'
        return
      } 
      
      // Check for regular user credentials
      if (formData.email === 'user@booksy.com' && formData.password === 'user123') {
        localStorage.setItem('userRole', 'user')
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userName', 'Regular User')
        // Force page reload to ensure auth context updates
        window.location.href = '/dashboard'
        return
      }
      
      // Invalid credentials
      setErrors({ general: 'Invalid email or password. Use demo credentials below.' })
    } catch (error) {
      setErrors({ general: 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900 text-white' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-teal-50 text-gray-900'
    }`}>
      {/* Theme Toggle Button */}
      <button 
        onClick={() => {
          console.log('Button clicked! Current theme:', isDark)
          toggleTheme()
        }}
        className="absolute top-8 right-8 p-3 text-gray-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg"
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
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center">
            <img 
              src="/BooksyLogosCorrect.png" 
              alt="Booksy Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 
            className="mt-6 text-3xl font-bold"
            style={{ color: isDark ? 'white' : 'black' }}
          >
            Welcome back
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}
          >
            Sign in to your Booksy Library account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6 transition-colors">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{errors.general}</p>
                </div>
              </div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? '#cbd5e1' : '#374151' }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-300 ${
                  errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? '#cbd5e1' : '#374151' }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-300 ${
                  errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600 rounded dark:bg-slate-700"
                />
                <label 
                  htmlFor="rememberMe" 
                  className="ml-2 block text-sm"
                  style={{ color: isDark ? '#cbd5e1' : '#374151' }}
                >
                  Remember me
                </label>
              </div>

              <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Forgot your password?
              </Link>
            </div>

            {/* Theme-responsive button with proper text colors */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                color: isDark ? 'white' : 'black',
                background: isDark 
                  ? 'linear-gradient(to right, #4f46e5, #7c3aed)' 
                  : 'linear-gradient(to right, #e0e7ff, #f3e8ff)'
              }}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5" 
                    style={{ color: isDark ? 'white' : 'black' }}
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 transition-colors">
            <h3 className="text-sm font-medium text-gray-800 dark:text-slate-200 mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-mono bg-gray-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded">user@booksy.com / user123</span>
              </div>
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono bg-gray-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded">admin@booksy.com / admin123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn