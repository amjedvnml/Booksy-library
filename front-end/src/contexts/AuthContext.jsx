import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')
      const userName = localStorage.getItem('userName')
      const userProfileImage = localStorage.getItem('userProfileImage')

      if (userRole && userEmail) {
        setUser({
          email: userEmail,
          role: userRole,
          name: userName || 'User',
          profileImage: userProfileImage || null
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('userRole', userData.role)
    localStorage.setItem('userEmail', userData.email)
    localStorage.setItem('userName', userData.name)
    if (userData.profileImage) {
      localStorage.setItem('userProfileImage', userData.profileImage)
    }
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
    if (userData.name) localStorage.setItem('userName', userData.name)
    if (userData.email) localStorage.setItem('userEmail', userData.email)
    if (userData.profileImage) {
      localStorage.setItem('userProfileImage', userData.profileImage)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userProfileImage')
  }

  const isAuthenticated = () => {
    return !!user
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isUser = () => {
    return user?.role === 'user'
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isUser,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext