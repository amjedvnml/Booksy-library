import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import api from '../../services/api'

const Admin = () => {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Data from backend (empty initially - will be fetched from API)
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  
  // Form states
  const [showUserForm, setShowUserForm] = useState(false)
  const [showBookForm, setShowBookForm] = useState(false)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  })
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    pdfFile: null,
    language: 'English',
    quantity: '1',
    pages: '',
    description: ''
  });

  const stats = {
    totalUsers: users.length,
    // Count active users - handle different possible field names and values
    // Active users are those who:
    // 1. Have status === 'active', OR
    // 2. Have isActive === true, OR
    // 3. Don't have inactive/banned/deleted status (default to active)
    activeUsers: users.filter(u => {
      if (u.status) {
        return u.status === 'active' || u.status === 'Active'
      }
      if (typeof u.isActive === 'boolean') {
        return u.isActive === true
      }
      if (u.accountStatus) {
        return u.accountStatus === 'active' || u.accountStatus === 'Active'
      }
      // If no status field exists, consider all users as active by default
      // (exclude only explicitly inactive/banned/deleted users)
      return !(u.status === 'inactive' || u.status === 'banned' || u.status === 'deleted')
    }).length,
    totalBooks: books.length,
    totalDownloads: books.reduce((sum, book) => sum + (book.downloads || 0), 0)
  }

  // Fetch books and users from API on component mount
  useEffect(() => {
    fetchBooks()
    fetchUsers()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔍 Fetching books...')
      const data = await api.getAllBooks()
      console.log('📚 Books data received:', data)
      console.log('📚 Books data type:', typeof data)
      console.log('📚 Books data keys:', Object.keys(data))
      console.log('📚 Full data structure:', JSON.stringify(data, null, 2))
      
      // Try multiple possible structures
      let booksArray = []
      if (Array.isArray(data)) {
        booksArray = data
      } else if (data.books) {
        booksArray = data.books
      } else if (data.data) {
        booksArray = Array.isArray(data.data) ? data.data : data.data.books || []
      }
      
      console.log('📖 Books array:', booksArray)
      console.log('📊 Number of books:', booksArray.length)
      
      if (booksArray.length > 0) {
        console.log('📋 First book sample:', booksArray[0])
        console.log('🔍 Book fields check:', {
          hasCategory: 'category' in booksArray[0],
          categoryValue: booksArray[0].category,
          hasGenre: 'genre' in booksArray[0],
          genreValue: booksArray[0].genre,
          hasPdfFile: 'pdfFile' in booksArray[0],
          pdfFileValue: booksArray[0].pdfFile,
          hasPdfUrl: 'pdfUrl' in booksArray[0],
          pdfUrlValue: booksArray[0].pdfUrl,
          allKeys: Object.keys(booksArray[0])
        })
        
        // Check if any books have category or pdfFile
        const booksWithCategory = booksArray.filter(b => b.category || b.genre).length
        const booksWithPdf = booksArray.filter(b => b.pdfFile || b.pdfUrl).length
        console.log('📊 Books with category:', booksWithCategory, 'out of', booksArray.length)
        console.log('📊 Books with PDF:', booksWithPdf, 'out of', booksArray.length)
      } else {
        console.warn('⚠️ Books array is empty! Check backend response structure.')
      }
      
      setBooks(booksArray)
    } catch (err) {
      setError(err.message)
      console.error('❌ Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('👥 Fetching users...')
      const data = await api.getUsers()
      console.log('👤 Users data received:', data)
      console.log('👤 Users data type:', typeof data)
      console.log('👤 Users data keys:', data ? Object.keys(data) : 'null')
      console.log('👤 Full data structure:', JSON.stringify(data, null, 2))
      
      // Try multiple possible structures
      let usersArray = []
      if (Array.isArray(data)) {
        usersArray = data
      } else if (data.users) {
        usersArray = data.users
      } else if (data.data) {
        usersArray = Array.isArray(data.data) ? data.data : data.data.users || []
      }
      
      console.log('👥 Users array:', usersArray)
      console.log('📊 Number of users:', usersArray.length)
      
      if (usersArray.length > 0) {
        console.log('👤 First user sample:', usersArray[0])
        console.log('🔍 User status field check:', {
          hasStatus: 'status' in usersArray[0],
          statusValue: usersArray[0].status,
          hasIsActive: 'isActive' in usersArray[0],
          isActiveValue: usersArray[0].isActive,
          hasAccountStatus: 'accountStatus' in usersArray[0],
          accountStatusValue: usersArray[0].accountStatus,
          allKeys: Object.keys(usersArray[0])
        })
        
        // Count active users for debugging
        const activeCount = usersArray.filter(u => {
          if (u.status) return u.status === 'active' || u.status === 'Active'
          if (typeof u.isActive === 'boolean') return u.isActive === true
          if (u.accountStatus) return u.accountStatus === 'active'
          return !(u.status === 'inactive' || u.status === 'banned' || u.status === 'deleted')
        }).length
        console.log('✅ Active users count:', activeCount, 'out of', usersArray.length)
      } else {
        console.warn('⚠️ Users array is empty! Check backend response structure.')
      }
      
      setUsers(usersArray)
    } catch (err) {
      setError(err.message)
      console.error('❌ Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    api.logout()
    navigate('/signin')
  }

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => (u.id || u._id) === userId)
      const newRole = user.role === 'admin' ? 'user' : 'admin'
      await api.updateUserRole(userId, newRole)
      
      // Update local state
      setUsers(users.map(user => 
        (user.id || user._id) === userId 
          ? { ...user, role: newRole }
          : user
      ))
      alert('User role updated successfully!')
    } catch (err) {
      alert('Error updating user role: ' + err.message)
      console.error('Error:', err)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId)
        setUsers(users.filter(user => (user.id || user._id) !== userId))
        alert('User deleted successfully!')
      } catch (err) {
        alert('Error deleting user: ' + err.message)
        console.error('Error:', err)
      }
    }
  }

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.deleteBook(bookId)
        setBooks(books.filter(book => book._id !== bookId || book.id !== bookId))
        alert('Book deleted successfully!')
      } catch (err) {
        alert('Error deleting book: ' + err.message)
      }
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!userForm.name || !userForm.email || !userForm.password) {
        throw new Error('Name, email, and password are required')
      }
      
      console.log('Creating user:', userForm.email)
      
      // ✅ CORRECT: Call the backend API
      const userData = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role
      }
      
      await api.createUser(userData)
      
      alert('User created successfully!')
      
      // Reset form
      setUserForm({ name: '', email: '', password: '', role: 'member' })
      setShowUserForm(false)
      
      // ✅ After creating, fetch users again from database
      await fetchUsers()
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to create user'
      setError(errorMessage)
      alert('Error creating user: ' + errorMessage)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!bookForm.title || !bookForm.author || !bookForm.quantity) {
        throw new Error('Title, Author, and Quantity are required')
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('You must be logged in to add books. Please sign in again.')
      }
      
      console.log('Adding book:', bookForm.title)
      
      const bookData = {
        title: bookForm.title,
        author: bookForm.author,
        language: bookForm.language || 'English',
        quantity: parseInt(bookForm.quantity) || 1,
        pages: parseInt(bookForm.pages) || 0,
        description: bookForm.description || '',
        pdfFile: bookForm.pdfFile
      }
      
      const result = await api.createBook(bookData)
      console.log('Book created:', result)
      
      alert('Book added successfully!')
      
      // Reset form and refresh books list
      setBookForm({ title: '', author: '', pdfFile: null, language: 'English', quantity: '1', pages: '', description: '' })
      setShowBookForm(false)
      await fetchBooks()
    } catch (err) {
      const errorMessage = err.message || 'Failed to add book'
      setError(errorMessage)
      alert('Error adding book: ' + errorMessage)
      console.error('Error:', err)
      
      // If authentication error, suggest re-login
      if (errorMessage.includes('logged in') || errorMessage.includes('token') || errorMessage.includes('authentication')) {
        console.error('Authentication issue detected. User may need to sign in again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      available: 'bg-green-100 text-green-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 sm:space-x-4 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Booksy Admin</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 hidden sm:block">Library Management Dashboard</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.activeUsers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Books</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalBooks}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalDownloads}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                Users Management
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`py-2 px-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'books'
                    ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                }`}
              >
                Books Management
              </button>
            </nav>
          </div>
        </div>

        {/* Users Management */}
        {activeTab === 'users' && (
          <>
            {/* Add User Form */}
            {showUserForm && (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New User</h3>
                <form onSubmit={handleAddUser}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={userForm.name}
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Role *
                      </label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Users Management</h2>
                  <button 
                    onClick={() => setShowUserForm(!showUserForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {showUserForm ? 'Hide Form' : 'Add User'}
                  </button>
                </div>
              </div>

            <div className="overflow-x-auto">
              {loading && users.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 dark:text-slate-400">Loading users...</p>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Get started by adding a new user.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Books Read</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {users.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profileImage ? (
                                <img className="h-10 w-10 rounded-full object-cover" src={user.profileImage} alt={user.name} />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500 dark:text-slate-400">{user.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.booksRead || user.borrowedBooks?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.joinDate || user.createdAt ? new Date(user.joinDate || user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.lastLogin || user.updatedAt ? new Date(user.lastLogin || user.updatedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => toggleUserStatus(user._id || user.id)}
                              className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                            >
                              {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id || user.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          </>
        )}

        {/* Books Management */}
        {activeTab === 'books' && (
          <>
            {/* Add Book Form */}
            {showBookForm && (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Book</h3>
                <form onSubmit={handleAddBook}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookForm.title}
                        onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="The Great Gatsby"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Author *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookForm.author}
                        onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="F. Scott Fitzgerald"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Language *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookForm.language}
                        onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="English"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={bookForm.quantity}
                        onChange={(e) => setBookForm({...bookForm, quantity: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="5"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Upload PDF File *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                        <input
                          type="file"
                          accept=".pdf"
                          required
                          onChange={(e) => setBookForm({...bookForm, pdfFile: e.target.files[0]})}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <svg className="w-12 h-12 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                              {bookForm.pdfFile ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  {bookForm.pdfFile.name}
                                </span>
                              ) : (
                                <>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Click to upload</span> or drag and drop
                                </>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500">PDF files only (MAX. 50MB)</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Pages *
                      </label>
                      <input
                        type="number"
                        required
                        value={bookForm.pages}
                        onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="180"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={bookForm.description}
                        onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
                        placeholder="Brief description of the book..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowBookForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading && (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      <span>{loading ? 'Adding...' : 'Add Book'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Books Management</h2>
                  <button 
                    onClick={() => setShowBookForm(!showBookForm)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {showBookForm ? 'Hide Form' : 'Add Book'}
                  </button>
                </div>
              </div>

            <div className="overflow-x-auto">
              {loading && books.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 dark:text-slate-400">Loading books...</p>
                  </div>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No books</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Get started by adding a new book.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">PDF Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Borrowed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Pages</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Added Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {books.map((book) => (
                    <tr key={book._id || book.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{book.title}</div>
                          <div className="text-sm text-gray-500 dark:text-slate-400">{book.author}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{book.category || book.genre || book.language || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {book.hasPDF || book.pdfFileName || book.pdfFile || book.pdfUrl || book.pdf ? (
                            <>
                              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-emerald-600 dark:text-emerald-400">Uploaded</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="text-sm text-gray-400 dark:text-slate-500">No PDF</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {book.quantity || book.totalCopies || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {book.borrowedCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {book.pages || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {book.addedDate || book.createdAt ? new Date(book.addedDate || book.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-emerald-600 hover:text-emerald-900">Edit</button>
                          <button 
                            onClick={() => deleteBook(book._id || book.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin