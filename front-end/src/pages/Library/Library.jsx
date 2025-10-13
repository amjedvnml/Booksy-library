import React, { useState } from 'react'
import { BookCard } from '../../components/BookCard/BookCard'

const Library = () => {
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('recent') // recent, title, author, rating
  const [filterGenre, setFilterGenre] = useState('all')

  const genres = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Philosophy', 'Biography', 'Poetry']

  const libraryBooks = [
    {
      title: "The Birth of the Clinic",
      author: "Michel Foucault",
      rating: "4.2",
      pages: "240",
      dateAdded: "2024-10-01",
      genre: "Philosophy",
      gradient: "from-purple-600 to-blue-600",
      status: "completed"
    },
    {
      title: "Naked Lunch",
      author: "William S. Burroughs",
      rating: "4.0",
      pages: "191",
      dateAdded: "2024-09-15",
      genre: "Fiction",
      gradient: "from-red-600 to-orange-600",
      status: "reading",
      progress: 65
    },
    {
      title: "The Structure of Scientific Revolutions",
      author: "Thomas S. Kuhn",
      rating: "4.3",
      pages: "212",
      dateAdded: "2024-09-20",
      genre: "Science",
      gradient: "from-blue-600 to-indigo-600",
      status: "to-read"
    },
    {
      title: "Our Lady of the Flowers",
      author: "Jean Genet",
      rating: "4.1",
      pages: "200",
      dateAdded: "2024-08-30",
      genre: "Fiction",
      gradient: "from-pink-600 to-purple-600",
      status: "completed"
    },
    {
      title: "The Order of Things",
      author: "Michel Foucault",
      rating: "4.4",
      pages: "387",
      dateAdded: "2024-08-15",
      genre: "Philosophy",
      gradient: "from-teal-600 to-cyan-600",
      status: "reading",
      progress: 23
    },
    {
      title: "Discipline and Punish",
      author: "Michel Foucault",
      rating: "4.2",
      pages: "333",
      dateAdded: "2024-07-20",
      genre: "Philosophy",
      gradient: "from-green-600 to-emerald-600",
      status: "completed"
    }
  ]

  const filteredBooks = libraryBooks.filter(book => 
    filterGenre === 'all' || book.genre.toLowerCase() === filterGenre.toLowerCase()
  )

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.localeCompare(b.author)
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating)
      case 'recent':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded)
    }
  })

  const StatusBadge = ({ status, progress }) => {
    const statusConfig = {
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'reading': { bg: 'bg-blue-100', text: 'text-blue-800', label: `Reading (${progress}%)` },
      'to-read': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'To Read' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Library</h1>
          <p className="text-gray-600">Manage your personal book collection</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            + Add Book
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Genre Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Genre:</span>
            <select 
              value={filterGenre} 
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {genres.map(genre => (
                <option key={genre} value={genre.toLowerCase()}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-800">{libraryBooks.length}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{libraryBooks.filter(b => b.status === 'completed').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Currently Reading</p>
              <p className="text-2xl font-bold text-gray-800">{libraryBooks.filter(b => b.status === 'reading').length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">To Read</p>
              <p className="text-2xl font-bold text-gray-800">{libraryBooks.filter(b => b.status === 'to-read').length}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Books Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedBooks.map((book, index) => (
            <div key={index} className="relative">
              <BookCard book={book} />
              <div className="mt-2">
                <StatusBadge status={book.status} progress={book.progress} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedBooks.map((book, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-12 rounded bg-gradient-to-br ${book.gradient} flex items-center justify-center text-white font-bold text-xs mr-3`}>
                          {book.title.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        {book.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.pages}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={book.status} progress={book.progress} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(book.dateAdded).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Library