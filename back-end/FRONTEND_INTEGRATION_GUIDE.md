# 🔗 Frontend Integration Guide

## 📍 **Your Live Backend API:**
```
https://booksy-library-backend.vercel.app
```

---

## 🎯 **Where to Put API Code in Frontend**

### **Recommended Folder Structure:**

```
frontend/
├── src/
│   ├── api/              ← CREATE THIS FOLDER
│   │   ├── config.js     ← API base URL and configuration
│   │   ├── auth.js       ← Authentication API calls
│   │   ├── books.js      ← Books API calls
│   │   └── axios.js      ← Axios instance (if using axios)
│   │
│   ├── components/       ← Your React/Vue components
│   ├── pages/           ← Your pages
│   ├── utils/           ← Helper functions
│   └── App.jsx          ← Main app file
```

---

## 📁 **Step 1: Create API Configuration File**

**File:** `src/api/config.js`

```javascript
// API Configuration - Base URL for all API calls
const API_BASE_URL = 'https://booksy-library-backend.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  // Base
  BASE_URL: API_BASE_URL,
  HEALTH: `${API_BASE_URL}/api/health`,
  
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
    UPDATE_PASSWORD: `${API_BASE_URL}/api/auth/updatepassword`,
    GET_BORROWED_BOOKS: `${API_BASE_URL}/api/auth/borrowed-books`,
  },
  
  // Books
  BOOKS: {
    BASE: `${API_BASE_URL}/api/books`,
    BY_ID: (id) => `${API_BASE_URL}/api/books/${id}`,
    BORROW: (id) => `${API_BASE_URL}/api/books/${id}/borrow`,
    RETURN: (id) => `${API_BASE_URL}/api/books/${id}/return`,
    SEARCH: `${API_BASE_URL}/api/books/search`,
  }
};

export default API_BASE_URL;
```

---

## 📁 **Step 2: Create Authentication API File**

**File:** `src/api/auth.js`

```javascript
import { API_ENDPOINTS } from './config';

// ============================================
// AUTHENTICATION API CALLS
// ============================================

/**
 * Register a new user
 * @param {Object} userData - {name, email, password, membershipNumber}
 * @returns {Promise} - {success, token, user}
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - {email, password}
 * @returns {Promise} - {success, token, user}
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Get current user profile
 * @returns {Promise} - User data
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.ME, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user');
    }

    return data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

/**
 * Update password
 * @param {Object} passwords - {currentPassword, newPassword}
 * @returns {Promise}
 */
export const updatePassword = async (passwords) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password update failed');
    }

    return data;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Get user's borrowed books
 * @returns {Promise} - Array of borrowed books
 */
export const getBorrowedBooks = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.GET_BORROWED_BOOKS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get borrowed books');
    }

    return data;
  } catch (error) {
    console.error('Get borrowed books error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get token from localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get user from localStorage
 * @returns {Object|null}
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
```

---

## 📁 **Step 3: Create Books API File**

**File:** `src/api/books.js`

```javascript
import { API_ENDPOINTS } from './config';
import { getToken } from './auth';

// ============================================
// BOOKS API CALLS
// ============================================

/**
 * Get all books with optional filters
 * @param {Object} filters - {page, limit, genre, availability, search}
 * @returns {Promise} - {success, count, pagination, data}
 */
export const getAllBooks = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.genre) queryParams.append('genre', filters.genre);
    if (filters.availability !== undefined) {
      queryParams.append('availability', filters.availability);
    }
    if (filters.search) queryParams.append('search', filters.search);

    const url = `${API_ENDPOINTS.BOOKS.BASE}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch books');
    }

    return data;
  } catch (error) {
    console.error('Get books error:', error);
    throw error;
  }
};

/**
 * Get single book by ID
 * @param {string} bookId
 * @returns {Promise} - Book data
 */
export const getBookById = async (bookId) => {
  try {
    const response = await fetch(API_ENDPOINTS.BOOKS.BY_ID(bookId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch book');
    }

    return data;
  } catch (error) {
    console.error('Get book error:', error);
    throw error;
  }
};

/**
 * Create a new book (Librarian/Admin only)
 * @param {Object} bookData - Book information
 * @returns {Promise} - Created book
 */
export const createBook = async (bookData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.BOOKS.BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create book');
    }

    return data;
  } catch (error) {
    console.error('Create book error:', error);
    throw error;
  }
};

/**
 * Update book (Librarian/Admin only)
 * @param {string} bookId
 * @param {Object} bookData - Updated book information
 * @returns {Promise} - Updated book
 */
export const updateBook = async (bookId, bookData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.BOOKS.BY_ID(bookId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update book');
    }

    return data;
  } catch (error) {
    console.error('Update book error:', error);
    throw error;
  }
};

/**
 * Delete book (Admin only)
 * @param {string} bookId
 * @returns {Promise}
 */
export const deleteBook = async (bookId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.BOOKS.BY_ID(bookId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete book');
    }

    return data;
  } catch (error) {
    console.error('Delete book error:', error);
    throw error;
  }
};

/**
 * Borrow a book
 * @param {string} bookId
 * @returns {Promise}
 */
export const borrowBook = async (bookId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.BOOKS.BORROW(bookId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to borrow book');
    }

    return data;
  } catch (error) {
    console.error('Borrow book error:', error);
    throw error;
  }
};

/**
 * Return a book
 * @param {string} bookId
 * @returns {Promise}
 */
export const returnBook = async (bookId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ENDPOINTS.BOOKS.RETURN(bookId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to return book');
    }

    return data;
  } catch (error) {
    console.error('Return book error:', error);
    throw error;
  }
};

/**
 * Search books
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
export const searchBooks = async (query) => {
  try {
    const url = `${API_ENDPOINTS.BOOKS.SEARCH}?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Search failed');
    }

    return data;
  } catch (error) {
    console.error('Search books error:', error);
    throw error;
  }
};
```

---

## 🎨 **Step 4: Usage in Components**

### **Example 1: Login Component**

```javascript
// src/components/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      
      console.log('Login successful:', data);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Booksy Library</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

---

### **Example 2: Books List Component**

```javascript
// src/components/BooksList.jsx
import React, { useState, useEffect } from 'react';
import { getAllBooks, borrowBook } from '../api/books';

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAllBooks({ page, limit: 10 });
      
      setBooks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const data = await borrowBook(bookId);
      
      alert('Book borrowed successfully!');
      
      // Refresh books list
      fetchBooks();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="books-list">
      <h2>Available Books</h2>
      
      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Available: {book.availableCopies} / {book.totalCopies}</p>
            
            {book.availableCopies > 0 && (
              <button onClick={() => handleBorrow(book._id)}>
                Borrow Book
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={!pagination.prev}
          >
            Previous
          </button>
          
          <span>Page {page}</span>
          
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={!pagination.next}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default BooksList;
```

---

### **Example 3: Register Component**

```javascript
// src/components/Register.jsx
import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await registerUser(formData);
      
      console.log('Registration successful:', data);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register for Booksy Library</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        
        <div>
          <label>Membership Number:</label>
          <input
            type="text"
            name="membershipNumber"
            value={formData.membershipNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
```

---

## 🛡️ **Step 5: Protected Routes (Optional)**

**File:** `src/components/ProtectedRoute.jsx`

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

**Usage in App:**

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BooksList from './components/BooksList';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/books" 
          element={
            <ProtectedRoute>
              <BooksList />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🎯 **Quick Start Checklist**

1. **Create API folder structure:**
   ```bash
   mkdir src/api
   ```

2. **Create these files:**
   - ✅ `src/api/config.js` (API endpoints)
   - ✅ `src/api/auth.js` (Authentication functions)
   - ✅ `src/api/books.js` (Books functions)

3. **Import in your components:**
   ```javascript
   import { loginUser, registerUser } from '../api/auth';
   import { getAllBooks, borrowBook } from '../api/books';
   ```

4. **Use in your components:**
   - Call API functions in event handlers
   - Handle loading states
   - Display errors to users
   - Update UI based on responses

---

## 🚀 **Your API is Ready!**

**Base URL:** `https://booksy-library-backend.vercel.app`

All the code examples above are ready to use in your frontend!

Just copy the files and start building your UI! 🎨
