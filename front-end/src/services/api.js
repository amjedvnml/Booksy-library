// API Base URL
const API_BASE_URL = 'https://booksy-library-backend.vercel.app/api'

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.warn('No authentication token found in localStorage')
  }
  return token
}

// Helper function to verify if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken()
  const user = localStorage.getItem('user')
  return !!(token && user)
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
    
    // Check if it's an authentication error
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error detected. Token may be invalid or expired.')
      
      // Check if error message indicates token issues
      if (errorMessage.includes('token') || errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
        // Optionally clear invalid token
        // localStorage.removeItem('token')
        // window.location.href = '/signin'
      }
    }
    
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
      console.log('Auth header added with token (first 20 chars):', token.substring(0, 20) + '...')
    } else {
      console.warn('No token available for Authorization header')
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
    // Try to use the /auth/me endpoint with PATCH method first
    // If backend doesn't support profile updates yet, this will fail gracefully
    
    const formData = new FormData()
    
    // Append all profile fields
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key])
      }
    })
    
    // Try multiple possible endpoints
    let response
    try {
      // First try: /auth/profile (RESTful endpoint)
      response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(true, true),
        body: formData
      })
      
      if (response.status === 404) {
        // Second try: /auth/me with PATCH
        response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'PATCH',
          headers: getHeaders(true, true),
          body: formData
        })
      }
      
      if (response.status === 404) {
        // Third try: /users/profile
        response = await fetch(`${API_BASE_URL}/users/profile`, {
          method: 'PUT',
          headers: getHeaders(true, true),
          body: formData
        })
      }
      
      if (response.status === 404) {
        // Backend doesn't support profile updates yet
        // Return a mock success response with the data we have
        console.warn('Backend profile update endpoint not available. Using local storage fallback.')
        
        // Convert profileData to include image URL if image was uploaded
        const mockUser = {
          name: profileData.name,
          email: profileData.email,
          role: JSON.parse(localStorage.getItem('user') || '{}').role || 'user'
        }
        
        // If there's a profile image file, convert to base64 for local storage
        if (profileData.profileImage && profileData.profileImage instanceof File) {
          const reader = new FileReader()
          const imageDataUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(profileData.profileImage)
          })
          mockUser.profileImage = imageDataUrl
        }
        
        return {
          user: mockUser,
          message: 'Profile updated locally (backend endpoint pending)',
          isLocalOnly: true
        }
      }
      
      return await handleResponse(response)
    } catch (fetchError) {
      console.error('Profile update fetch error:', fetchError)
      throw fetchError
    }
  } catch (error) {
    console.error('Update profile failed:', error)
    throw error
  }
}

export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('profileImage', imageFile)
    
    let response
    try {
      // Try the dedicated image upload endpoint
      response = await fetch(`${API_BASE_URL}/auth/profile/image`, {
        method: 'POST',
        headers: getHeaders(true, true),
        body: formData
      })
      
      if (response.status === 404) {
        // Fallback: include in profile update
        return await updateProfile({ profileImage: imageFile })
      }
      
      return await handleResponse(response)
    } catch (fetchError) {
      console.error('Image upload error:', fetchError)
      throw fetchError
    }
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
    // Check if user is authenticated
    const token = getAuthToken()
    if (!token) {
      throw new Error('You must be logged in to create a book')
    }
    
    console.log('Creating book with token:', token ? 'Token present' : 'No token')
    console.log('Book data:', {
      title: bookData.title,
      author: bookData.author,
      hasPdfFile: !!bookData.pdfFile
    })
    
    const formData = new FormData()
    
    // Append all book fields
    Object.keys(bookData).forEach(key => {
      if (bookData[key] !== null && bookData[key] !== undefined) {
        formData.append(key, bookData[key])
      }
    })
    
    console.log('Sending request to:', `${API_BASE_URL}/books`)
    
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: getHeaders(true, true), // isFormData = true
      body: formData
    })
    
    console.log('Response status:', response.status)
    
    const result = await handleResponse(response)
    console.log('Book created successfully:', result)
    
    return result
  } catch (error) {
    console.error('Create book failed:', error)
    console.error('Error details:', {
      message: error.message,
      name: error.name
    })
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
// User Management APIs (Admin Only)
// =========================
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Get users failed:', error)
    throw error
  }
}

export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ role })
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Update user role failed:', error)
    throw error
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Delete user failed:', error)
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
  returnBook,
  
  // User Management (Admin)
  getUsers,
  updateUserRole,
  deleteUser
}

export default api
