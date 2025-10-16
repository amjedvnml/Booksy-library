# API Integration Guide

## Import the API Service

```javascript
import api from '../services/api'
// or import specific functions:
import { login, getAllBooks, createBook } from '../services/api'
```

## Authentication

### Register a New User
```javascript
const handleRegister = async () => {
  try {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }
    
    const response = await api.register(userData)
    console.log('User registered:', response)
    // Token is automatically stored in localStorage
  } catch (error) {
    console.error('Registration error:', error.message)
  }
}
```

### Login
```javascript
const handleLogin = async () => {
  try {
    const credentials = {
      email: 'john@example.com',
      password: 'password123'
    }
    
    const response = await api.login(credentials)
    console.log('Logged in:', response)
    // Token is automatically stored in localStorage
  } catch (error) {
    console.error('Login error:', error.message)
  }
}
```

### Get Current User
```javascript
const fetchCurrentUser = async () => {
  try {
    const user = await api.getCurrentUser()
    console.log('Current user:', user)
  } catch (error) {
    console.error('Error fetching user:', error.message)
  }
}
```

### Logout
```javascript
const handleLogout = () => {
  api.logout()
  // Token is removed from localStorage
  navigate('/signin')
}
```

## Books Management

### Get All Books
```javascript
const fetchBooks = async () => {
  try {
    const books = await api.getAllBooks()
    setBooks(books)
  } catch (error) {
    console.error('Error fetching books:', error.message)
  }
}

// Use in useEffect
useEffect(() => {
  fetchBooks()
}, [])
```

### Create a New Book
```javascript
const handleCreateBook = async (formData) => {
  try {
    const bookData = {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      pages: 180,
      publishYear: 1925,
      description: 'A classic novel...',
      pdfFile: file // File object from input
    }
    
    const newBook = await api.createBook(bookData)
    console.log('Book created:', newBook)
    
    // Refresh books list
    fetchBooks()
  } catch (error) {
    console.error('Error creating book:', error.message)
  }
}
```

### Get Single Book
```javascript
const fetchBookDetails = async (bookId) => {
  try {
    const book = await api.getBookById(bookId)
    setBookDetails(book)
  } catch (error) {
    console.error('Error fetching book:', error.message)
  }
}
```

### Update a Book
```javascript
const handleUpdateBook = async (bookId, updatedData) => {
  try {
    const response = await api.updateBook(bookId, updatedData)
    console.log('Book updated:', response)
    
    // Refresh books list
    fetchBooks()
  } catch (error) {
    console.error('Error updating book:', error.message)
  }
}
```

### Delete a Book
```javascript
const handleDeleteBook = async (bookId) => {
  try {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await api.deleteBook(bookId)
      console.log('Book deleted')
      
      // Remove from local state
      setBooks(books.filter(book => book.id !== bookId))
    }
  } catch (error) {
    console.error('Error deleting book:', error.message)
  }
}
```

## Borrowing System

### Borrow a Book
```javascript
const handleBorrowBook = async (bookId) => {
  try {
    const response = await api.borrowBook(bookId)
    console.log('Book borrowed:', response)
    
    // Refresh books to update availability
    fetchBooks()
  } catch (error) {
    console.error('Error borrowing book:', error.message)
    alert(error.message)
  }
}
```

### Return a Book
```javascript
const handleReturnBook = async (bookId) => {
  try {
    const response = await api.returnBook(bookId)
    console.log('Book returned:', response)
    
    // Refresh books to update availability
    fetchBooks()
  } catch (error) {
    console.error('Error returning book:', error.message)
  }
}
```

## Health Check
```javascript
const checkBackendHealth = async () => {
  try {
    const health = await api.healthCheck()
    console.log('Backend status:', health)
  } catch (error) {
    console.error('Backend is down:', error.message)
  }
}
```

## Complete Example: Admin Component

```javascript
import React, { useState, useEffect } from 'react'
import api from '../services/api'

const Admin = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getAllBooks()
      setBooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (bookData) => {
    try {
      await api.createBook(bookData)
      fetchBooks() // Refresh list
      alert('Book added successfully!')
    } catch (err) {
      alert('Error adding book: ' + err.message)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Delete this book?')) {
      try {
        await api.deleteBook(bookId)
        setBooks(books.filter(book => book._id !== bookId))
        alert('Book deleted successfully!')
      } catch (err) {
        alert('Error deleting book: ' + err.message)
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Your UI here */}
    </div>
  )
}

export default Admin
```

## Error Handling Best Practices

```javascript
const handleApiCall = async () => {
  try {
    const result = await api.someFunction()
    // Success
  } catch (error) {
    // Handle different error types
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      // Token expired or invalid
      api.logout()
      navigate('/signin')
    } else if (error.message.includes('Network')) {
      // Network error
      alert('Network error. Please check your connection.')
    } else {
      // Other errors
      alert(error.message)
    }
  }
}
```

## Loading States

```javascript
const [loading, setLoading] = useState(false)

const fetchData = async () => {
  setLoading(true)
  try {
    const data = await api.getAllBooks()
    setBooks(data)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}
```

## Tips

1. **Token Management**: The API service automatically handles JWT tokens. They're stored in localStorage and included in all authenticated requests.

2. **FormData for Files**: When uploading books with PDF files, the API service automatically converts to FormData.

3. **Error Messages**: All errors from the backend are caught and can be displayed to users.

4. **Protected Routes**: Make sure to check if user is authenticated before accessing protected endpoints.

5. **Response Format**: All responses are automatically parsed from JSON.
