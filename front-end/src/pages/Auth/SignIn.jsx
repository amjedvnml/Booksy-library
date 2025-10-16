import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const SignIn = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const { login: authLogin } = useAuth()
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
      // Call the real API
      const response = await api.login({
        email: formData.email,
        password: formData.password
      })
      
      // Store user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
        authLogin(response.user)
      }
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
      
    } catch (error) {
      setErrors({ general: error.message || 'Invalid email or password' })
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
        className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 p-2 sm:p-3 text-gray-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-lg"
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
      
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center">
            <img 
              src="/BooksyLogosCorrect.png" 
              alt="Booksy Logo" 
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
            />
          </div>
          <h2 
            className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold"
            style={{ color: isDark ? 'white' : 'black' }}
          >
            Welcome back
          </h2>
          <p 
            className="mt-2 text-xs sm:text-sm"
            style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}
          >
            Sign in to your Booksy Library account
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 sm:p-8 space-y-4 sm:space-y-6 transition-colors">
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
              className={`w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span 
                className="px-2 bg-white dark:bg-slate-800"
                style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => {
              // TODO: Implement Google Sign In
              alert('Google Sign In will be implemented soon!')
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span 
              className="font-medium"
              style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}
            >
              Sign in with Google
            </span>
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn