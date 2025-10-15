import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const RightSidebar = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Current book and recommendations from backend (null initially - will be fetched from API)
  const currentBook = null
  const recommendations = []

  return (
    <>
      {/* Desktop Sidebar - Hidden on Mobile/Tablet */}
      <div className="hidden xl:flex xl:w-80 bg-slate-900 text-white flex-col h-screen">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-slate-700">
        <h2 className="text-lg font-semibold">About the book</h2>
      </div>

      {/* Current Book */}
      <div className="p-4 lg:p-6 border-b border-slate-700">
        {currentBook ? (
          <>
            <div className="mb-4">
              <div className="w-28 lg:w-32 h-40 lg:h-44 mx-auto rounded-lg overflow-hidden mb-4">
                <div className={`w-full h-full bg-gradient-to-br ${currentBook.cover} flex items-center justify-center`}>
                  <div className="text-white font-bold text-lg">TC</div>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-white mb-1">{currentBook.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{currentBook.author}</p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Progress</span>
                <span className="text-white">{currentBook.pages}</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentBook.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{currentBook.progress}% complete</span>
                <span className="text-slate-400">{currentBook.timeLeft}</span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => navigate(`/reader/${currentBook.id}`)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors mt-4"
            >
              Continue Reading
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No book currently reading</p>
          </div>
        )}
      </div>

      {/* Plot Section */}
      <div className="p-4 lg:p-6 border-b border-slate-700 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-3">Plot</h3>
        {currentBook ? (
          <>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentBook.plot || 'No plot description available.'}
            </p>
            
            <button className="text-emerald-400 text-sm font-medium mt-3 hover:text-emerald-300 transition-colors">
              Read more
            </button>
          </>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">No plot information available</p>
        )}
      </div>

      {/* Recommendations */}
      <div className="p-4 lg:p-6">
        <h3 className="font-semibold mb-4">You might also like</h3>
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((book, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="w-10 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">{book.title.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{book.title}</h4>
                  <p className="text-xs text-slate-400">{book.author}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs text-slate-300">{book.rating}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">No recommendations available</p>
        )}
      </div>
    </div>

      {/* Mobile & Tablet Fixed Bottom - Shows Current Reading Book */}
      {currentBook && (
        <div className={`xl:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        } border-t shadow-lg`}>
          {/* Expandable Content */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-96' : 'max-h-0'
          }`}>
            <div className="p-4 border-b border-slate-700 dark:border-slate-700">
              {/* Book Cover and Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <div className={`w-full h-full bg-gradient-to-br ${currentBook.cover} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                      {currentBook.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm mb-1 truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentBook.title}
                  </h3>
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    {currentBook.author}
                  </p>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {currentBook.pages}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className={`w-full rounded-full h-2 ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentBook.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                    {currentBook.progress}% complete
                  </span>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                    {currentBook.timeLeft}
                  </span>
                </div>
              </div>

              {/* Plot Preview */}
              <div className="mb-4">
                <h4 className={`text-xs font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Plot
                </h4>
                <p className={`text-xs leading-relaxed line-clamp-3 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  {currentBook.plot}
                </p>
              </div>
            </div>
          </div>

          {/* Main Bar - Always Visible */}
          <div className="p-3">
            <div className="flex items-center space-x-3">
              {/* Collapse/Expand Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-slate-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              {/* Book Thumbnail */}
              <div className="w-10 h-12 rounded overflow-hidden flex-shrink-0">
                <div className={`w-full h-full bg-gradient-to-br ${currentBook.cover} flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">
                    {currentBook.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentBook.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-20 h-1 rounded-full ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-1 rounded-full"
                      style={{ width: `${currentBook.progress}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    {currentBook.progress}%
                  </span>
                </div>
              </div>

              {/* Continue Reading Button */}
              <button
                onClick={() => navigate(`/reader/${currentBook.id}`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RightSidebar