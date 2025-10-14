import React from 'react'

const BookCard = ({ book, size = 'normal' }) => {
  const isLarge = size === 'large'
  
  return (
    <div className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
      isLarge ? 'w-full' : 'w-36 sm:w-40 md:w-44'
    }`}>
      {/* Book Cover */}
      <div className={`relative overflow-hidden rounded-lg shadow-lg mb-2 sm:mb-3 ${
        isLarge ? 'h-56 sm:h-64' : 'h-48 sm:h-52 md:h-56'
      }`}>
        <div className={`w-full h-full bg-gradient-to-br ${book.gradient} flex items-center justify-center`}>
          {book.image ? (
            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white font-bold text-base sm:text-lg">{book.title.charAt(0)}</div>
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white/90 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Read Now
          </button>
        </div>

        {/* Progress Bar (if reading) */}
        {book.progress && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-1.5 sm:p-2">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="px-1">
        <h3 className={`font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2 ${
          isLarge ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
        }`}>
          {book.title}
        </h3>
        <p className="text-gray-500 dark:text-slate-400 text-xs mb-1 sm:mb-2 truncate">{book.author}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs text-gray-600 dark:text-slate-400">{book.rating}</span>
          </div>
          {book.pages && (
            <span className="text-xs text-gray-500 dark:text-slate-400">{book.pages}p</span>
          )}
        </div>
      </div>
    </div>
  )
}

const FeaturedBookCard = ({ book }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Book Cover */}
        <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
          <div className={`w-full h-full bg-gradient-to-br ${book.gradient} flex items-center justify-center`}>
            {book.image ? (
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-white font-bold text-xs sm:text-sm">{book.title.charAt(0)}</div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base mb-1 line-clamp-2 sm:truncate">{book.title}</h3>
          <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mb-2 truncate">{book.author}</p>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-xs sm:text-sm">★</span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">{book.rating}</span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-xs text-gray-500 dark:text-slate-400">{book.pages}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{book.duration}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{book.size}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="hidden sm:block bg-emerald-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          Read
        </button>
      </div>
    </div>
  )
}

export { BookCard, FeaturedBookCard }