// API Base URL
const API_BASE_URL = 'https://booksy-library-backend.vercel.app/api'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials)
    })
    const data = await handleResponse(response)
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    
    return data
  } catch (error) {
    console.error('Login failed:', error)
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
