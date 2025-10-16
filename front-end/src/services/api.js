// API Base URL
const API_BASE_URL = 'https://booksy-library-backend.vercel.app/api'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Try to parse JSON response
  let data
  try {
    data = await response.json()
  } catch (error) {
    // If JSON parsing fails, create a generic error object
    data = { message: 'Server error occurred' }
  }
  
  if (!response.ok) {
    // Handle different error formats from the backend
    const errorMessage = data.message || data.error || data.msg || 'Something went wrong'
    throw new Error(errorMessage)
  }
  
  return data
}

// Helper function to create headers
const getHeaders = (includeAuth = true, isFormData = false) => {
  const headers = {}
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  
  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// =========================
// Health Check
// =========================
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return await handleResponse(response)
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

// =========================
// Authentication APIs
// =========================
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData)
    })
    const data = await handleResponse(response)
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    
    return data
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

export const login = async (credentials) => {
  try {
    console.log('Attempting login with:', { email: credentials.email })
    console.log('API URL:', `${API_BASE_URL}/auth/login`)
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials)
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const data = await handleResponse(response)
    
    console.log('Login successful:', { user: data.user?.email, hasToken: !!data.token })
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    
    return data
  } catch (error) {
    console.error('Login failed:', error)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Get current user failed:', error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// =========================
// User Profile APIs
// =========================
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData()
    
    // Append all profile fields
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key])
      }
    })
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true, true), // isFormData = true for image upload
      body: formData
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Update profile failed:', error)
    throw error
  }
}

export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('profileImage', imageFile)
    
    const response = await fetch(`${API_BASE_URL}/auth/profile/image`, {
      method: 'POST',
      headers: getHeaders(true, true),
      body: formData
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Upload profile image failed:', error)
    throw error
  }
}

// =========================
// Books APIs
// =========================
export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Get books failed:', error)
    throw error
  }
}

export const createBook = async (bookData) => {
  try {
    const formData = new FormData()
    
    // Append all book fields
    Object.keys(bookData).forEach(key => {
      if (bookData[key] !== null && bookData[key] !== undefined) {
        formData.append(key, bookData[key])
      }
    })
    
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: getHeaders(true, true), // isFormData = true
      body: formData
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Create book failed:', error)
    throw error
  }
}

export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Get book failed:', error)
    throw error
  }
}

export const updateBook = async (bookId, bookData) => {
  try {
    const formData = new FormData()
    
    // Append all book fields
    Object.keys(bookData).forEach(key => {
      if (bookData[key] !== null && bookData[key] !== undefined) {
        formData.append(key, bookData[key])
      }
    })
    
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: getHeaders(true, true),
      body: formData
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Update book failed:', error)
    throw error
  }
}

export const deleteBook = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Delete book failed:', error)
    throw error
  }
}

// =========================
// Borrowing APIs
// =========================
export const borrowBook = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/borrow`, {
      method: 'POST',
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Borrow book failed:', error)
    throw error
  }
}

export const returnBook = async (bookId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/return`, {
      method: 'POST',
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Return book failed:', error)
    throw error
  }
}

// =========================
// Export all APIs
// =========================
const api = {
  // Health
  healthCheck,
  
  // Auth
  register,
  login,
  getCurrentUser,
  logout,
  
  // Profile
  updateProfile,
  uploadProfileImage,
  
  // Books
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  
  // Borrowing
  borrowBook,
  returnBook
}

export default api
