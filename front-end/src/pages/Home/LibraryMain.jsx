import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { BookCard, FeaturedBookCard } from '../../components/BookCard/BookCard'

const LibraryMain = () => {
  const { isDark } = useTheme()
  
  // Books from backend (empty initially - will be fetched from API)
  const featuredBooks = []
  const weekModernClassics = []
  const recentBooks = []

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Featured Books Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Featured Books</h2>
          <button className="text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View all →
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {featuredBooks.map((book, index) => (
            <FeaturedBookCard key={index} book={book} />
          ))}
        </div>
      </section>

      {/* Week of Modern Classics */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Week of Modern Classics</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 hidden sm:block">Curated selection of contemporary literature</p>
          </div>
          <button className="text-emerald-600 text-xs sm:text-sm font-medium hover:text-emerald-700 transition-colors">
            View all →
          </button>
        </div>
        
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {weekModernClassics.map((book, index) => (
            <div key={index} className="flex-shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Books Grid */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Recently Added</h2>
          <div className="hidden sm:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {recentBooks.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>
      </section>

      {/* Load More Section */}
      <div className="flex justify-center pt-6 sm:pt-8">
        <button className="bg-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-emerald-700 transition-colors w-full sm:w-auto">
          Load More Books
        </button>
      </div>
    </div>
  )
}

export default LibraryMain