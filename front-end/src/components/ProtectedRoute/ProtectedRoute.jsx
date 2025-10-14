import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 dark:text-slate-300">Loading...</span>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to sign in
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />
  }

  // Admin required but user is not admin - redirect to dashboard
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute