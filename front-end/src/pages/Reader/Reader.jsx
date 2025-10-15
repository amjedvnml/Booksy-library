import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const Reader = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  
  // Reading settings
  const [fontSize, setFontSize] = useState(18)
  const [fontFamily, setFontFamily] = useState('serif')
  const [lineHeight, setLineHeight] = useState(1.8)
  const [readingMode, setReadingMode] = useState('light') // light, dark, sepia
  const [showSettings, setShowSettings] = useState(false)
  const [showTOC, setShowTOC] = useState(false)
  
  // Book content and navigation
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(100)
  const [bookContent, setBookContent] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  
  // Sample book data (will be fetched from API)
  const book = {
    id: bookId,
    title: "Sample Book Title",
    author: "Author Name",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

This is sample content. In production, this will load the actual book content from your backend API.`,
    tableOfContents: [
      { id: 1, title: "Chapter 1: Introduction", page: 1 },
      { id: 2, title: "Chapter 2: Getting Started", page: 15 },
      { id: 3, title: "Chapter 3: Advanced Topics", page: 32 },
      { id: 4, title: "Chapter 4: Conclusion", page: 85 },
    ]
  }

  // Reading mode colors
  const modeColors = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      secondary: 'text-gray-600'
    },
    dark: {
      bg: 'bg-slate-900',
      text: 'text-white',
      secondary: 'text-slate-400'
    },
    sepia: {
      bg: 'bg-[#f4ecd8]',
      text: 'text-[#5c4a2f]',
      secondary: 'text-[#8b7355]'
    }
  }

  const currentMode = modeColors[readingMode]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1)
      } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(prev => prev - 1)
      } else if (e.key === 'Escape') {
        setShowSettings(false)
        setShowTOC(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, totalPages])

  const addBookmark = () => {
    if (!bookmarks.includes(currentPage)) {
      setBookmarks([...bookmarks, currentPage])
    }
  }

  const removeBookmark = () => {
    setBookmarks(bookmarks.filter(page => page !== currentPage))
  }

  const isBookmarked = bookmarks.includes(currentPage)

  const goToPage = (page) => {
    setCurrentPage(page)
    setShowTOC(false)
  }

  return (
    <div className={`min-h-screen ${currentMode.bg} ${currentMode.text} transition-colors duration-300`}>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 ${currentMode.bg} border-b ${readingMode === 'dark' ? 'border-slate-700' : 'border-gray-200'} z-40 transition-all`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left - Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-2 ${currentMode.secondary} hover:${currentMode.text} transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          {/* Center - Book Info */}
          <div className="text-center hidden md:block">
            <h2 className={`font-semibold ${currentMode.text}`}>{book.title}</h2>
            <p className={`text-sm ${currentMode.secondary}`}>{book.author}</p>
          </div>

          {/* Right - Controls */}
          <div className="flex items-center space-x-2">
            {/* Bookmark */}
            <button
              onClick={isBookmarked ? removeBookmark : addBookmark}
              className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${isBookmarked ? 'text-yellow-500' : currentMode.secondary}`}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Table of Contents */}
            <button
              onClick={() => setShowTOC(!showTOC)}
              className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${currentMode.secondary}`}
              title="Table of contents"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${currentMode.secondary}`}
              title="Reader settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`fixed top-16 right-4 w-80 ${currentMode.bg} rounded-xl shadow-2xl border ${readingMode === 'dark' ? 'border-slate-700' : 'border-gray-200'} z-50 p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${currentMode.text}`}>Reading Settings</h3>
          
          {/* Reading Mode */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${currentMode.secondary}`}>Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setReadingMode('light')}
                className={`py-2 px-3 rounded-lg border-2 transition-all ${
                  readingMode === 'light'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-medium">Light</div>
              </button>
              <button
                onClick={() => setReadingMode('dark')}
                className={`py-2 px-3 rounded-lg border-2 transition-all ${
                  readingMode === 'dark'
                    ? 'border-emerald-500 bg-slate-800'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-medium">Dark</div>
              </button>
              <button
                onClick={() => setReadingMode('sepia')}
                className={`py-2 px-3 rounded-lg border-2 transition-all ${
                  readingMode === 'sepia'
                    ? 'border-emerald-500 bg-[#f4ecd8]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-medium">Sepia</div>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${currentMode.secondary}`}>
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="14"
              max="28"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Font Family */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${currentMode.secondary}`}>Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${readingMode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'}`}
            >
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>

          {/* Line Height */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${currentMode.secondary}`}>
              Line Height: {lineHeight}
            </label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Table of Contents Panel */}
      {showTOC && (
        <div className={`fixed top-16 right-4 w-80 ${currentMode.bg} rounded-xl shadow-2xl border ${readingMode === 'dark' ? 'border-slate-700' : 'border-gray-200'} z-50 p-6 max-h-[70vh] overflow-y-auto`}>
          <h3 className={`text-lg font-semibold mb-4 ${currentMode.text}`}>Table of Contents</h3>
          <div className="space-y-2">
            {book.tableOfContents.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => goToPage(chapter.page)}
                className={`w-full text-left p-3 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                  currentPage >= chapter.page ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className={`font-medium ${currentMode.text}`}>{chapter.title}</div>
                <div className={`text-sm ${currentMode.secondary}`}>Page {chapter.page}</div>
              </button>
            ))}
          </div>

          {bookmarks.length > 0 && (
            <>
              <div className={`mt-6 pt-6 border-t ${readingMode === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <h4 className={`text-md font-semibold mb-3 ${currentMode.text}`}>Bookmarks</h4>
                <div className="space-y-2">
                  {bookmarks.map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-full text-left p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors flex items-center justify-between`}
                    >
                      <span className={currentMode.text}>Page {page}</span>
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Reading Area */}
      <div className="pt-20 pb-20 px-4">
        <div
          className="max-w-3xl mx-auto"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            lineHeight: lineHeight,
          }}
        >
          <div className={`prose prose-lg max-w-none ${currentMode.text}`}>
            {book.content}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${currentMode.bg} border-t ${readingMode === 'dark' ? 'border-slate-700' : 'border-gray-200'} z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : `${currentMode.secondary} hover:${currentMode.text} hover:bg-opacity-10 hover:bg-gray-500`
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className={`text-center ${currentMode.secondary}`}>
              <div className="text-sm">
                Page <span className={currentMode.text}>{currentPage}</span> of {totalPages}
              </div>
              <div className="text-xs mt-1">
                {Math.round((currentPage / totalPages) * 100)}% complete
              </div>
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'opacity-30 cursor-not-allowed'
                  : `${currentMode.secondary} hover:${currentMode.text} hover:bg-opacity-10 hover:bg-gray-500`
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className={`w-full ${readingMode === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reader
