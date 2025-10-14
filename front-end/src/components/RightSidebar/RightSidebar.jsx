import React from 'react'

const RightSidebar = () => {
  const currentBook = {
    title: "The Cut-Up Trilogy: Nova Express",
    author: "William S. Burroughs",
    cover: "from-indigo-600 to-purple-600",
    progress: 75,
    pages: "104/195",
    timeLeft: "2h 15m left"
  }

  const recommendations = [
    { title: "Naked Lunch", author: "William S. Burroughs", rating: "4.2" },
    { title: "Cities of the Red Night", author: "William S. Burroughs", rating: "4.1" },
    { title: "The Western Lands", author: "William S. Burroughs", rating: "4.0" }
  ]

  return (
    <div className="hidden xl:flex xl:w-80 bg-slate-900 text-white flex-col h-screen">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-slate-700">
        <h2 className="text-lg font-semibold">About the book</h2>
      </div>

      {/* Current Book */}
      <div className="p-4 lg:p-6 border-b border-slate-700">
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
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors mt-4">
          Continue Reading
        </button>
      </div>

      {/* Plot Section */}
      <div className="p-4 lg:p-6 border-b border-slate-700 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-3">Plot</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          With Naked Lunch was an initial space community spaces and critical landscapes. 
          This groundbreaking work explores the fragmented nature of consciousness and reality 
          through experimental narrative techniques that challenge conventional storytelling.
        </p>
        
        <button className="text-emerald-400 text-sm font-medium mt-3 hover:text-emerald-300 transition-colors">
          Read more
        </button>
      </div>

      {/* Recommendations */}
      <div className="p-4 lg:p-6">
        <h3 className="font-semibold mb-4">You might also like</h3>
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
      </div>
    </div>
  )
}

export default RightSidebar