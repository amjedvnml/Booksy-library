import React, { useState } from 'react'
import { BookCard } from '../../components/BookCard/BookCard'

const MyReading = () => {
  const [activeTab, setActiveTab] = useState('currently-reading')

  const currentlyReading = [
    {
      title: "The Cut-Up Trilogy: Nova Express",
      author: "William S. Burroughs",
      rating: "4.0",
      pages: "195",
      gradient: "from-indigo-600 to-purple-600",
      progress: 75,
      pagesRead: 146,
      totalPages: 195,
      timeLeft: "2h 15m",
      lastRead: "2024-10-12",
      startedDate: "2024-09-20",
      avgPagesPerDay: 4.2
    },
    {
      title: "Naked Lunch",
      author: "William S. Burroughs", 
      rating: "4.0",
      pages: "191",
      gradient: "from-red-600 to-orange-600",
      progress: 65,
      pagesRead: 124,
      totalPages: 191,
      timeLeft: "1h 45m",
      lastRead: "2024-10-11",
      startedDate: "2024-09-15",
      avgPagesPerDay: 3.8
    }
  ]

  const recentlyFinished = [
    {
      title: "The Birth of the Clinic",
      author: "Michel Foucault",
      rating: "4.2",
      pages: "240",
      gradient: "from-purple-600 to-blue-600",
      finishedDate: "2024-10-05",
      readingTime: "12 days",
      userRating: 4
    },
    {
      title: "Our Lady of the Flowers",
      author: "Jean Genet",
      rating: "4.1",
      pages: "200", 
      gradient: "from-pink-600 to-purple-600",
      finishedDate: "2024-09-28",
      readingTime: "8 days",
      userRating: 5
    },
    {
      title: "Discipline and Punish",
      author: "Michel Foucault",
      rating: "4.2",
      pages: "333",
      gradient: "from-green-600 to-emerald-600",
      finishedDate: "2024-09-15",
      readingTime: "15 days",
      userRating: 4
    }
  ]

  const readingGoals = {
    yearlyGoal: 50,
    currentCount: 32,
    pagesGoal: 15000,
    currentPages: 9847,
    streak: 15
  }

  const tabs = [
    { id: 'currently-reading', label: 'Currently Reading', count: currentlyReading.length },
    { id: 'recently-finished', label: 'Recently Finished', count: recentlyFinished.length },
    { id: 'reading-stats', label: 'Reading Stats', count: null }
  ]

  const ProgressCard = ({ book }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        {/* Book Cover */}
        <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
          <div className={`w-full h-full bg-gradient-to-br ${book.gradient} flex items-center justify-center text-white font-bold`}>
            {book.title.charAt(0)}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{book.author}</p>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{book.pagesRead} / {book.totalPages} pages</span>
              <span>{book.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Reading Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Time Left</p>
              <p className="font-medium">{book.timeLeft}</p>
            </div>
            <div>
              <p className="text-gray-500">Avg/Day</p>
              <p className="font-medium">{book.avgPagesPerDay} pages</p>
            </div>
            <div>
              <p className="text-gray-500">Last Read</p>
              <p className="font-medium">{new Date(book.lastRead).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors">
              Continue Reading
            </button>
            <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const FinishedCard = ({ book }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <div className={`w-full h-full bg-gradient-to-br ${book.gradient} flex items-center justify-center text-white font-bold text-sm`}>
            {book.title.charAt(0)}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{book.author}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span>Finished: {new Date(book.finishedDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>{book.readingTime}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Your rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-lg ${star <= book.userRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
              Write Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Reading</h1>
        <p className="text-gray-600">Track your reading progress and goals</p>
      </div>

      {/* Reading Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Books This Year</h3>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{readingGoals.currentCount}</p>
          <p className="text-sm text-gray-500">of {readingGoals.yearlyGoal} goal</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${(readingGoals.currentCount / readingGoals.yearlyGoal) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pages Read</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{readingGoals.currentPages.toLocaleString()}</p>
          <p className="text-sm text-gray-500">of {readingGoals.pagesGoal.toLocaleString()} goal</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(readingGoals.currentPages / readingGoals.pagesGoal) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Reading Streak</h3>
            <div className="bg-orange-100 p-2 rounded-lg">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{readingGoals.streak}</p>
          <p className="text-sm text-gray-500">days in a row</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg per Month</h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">3.2</p>
          <p className="text-sm text-gray-500">books per month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'currently-reading' && (
          <div className="space-y-6">
            {currentlyReading.map((book, index) => (
              <ProgressCard key={index} book={book} />
            ))}
            
            {currentlyReading.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No books currently reading</h3>
                <p className="text-gray-600 mb-4">Start reading a book to track your progress here</p>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Find a Book
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recently-finished' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentlyFinished.map((book, index) => (
              <FinishedCard key={index} book={book} />
            ))}
          </div>
        )}

        {activeTab === 'reading-stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reading Patterns */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reading Patterns</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Genre</span>
                  <span className="font-medium">Philosophy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Book Length</span>
                  <span className="font-medium">267 pages</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fastest Read</span>
                  <span className="font-medium">3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longest Read</span>
                  <span className="font-medium">28 days</span>
                </div>
              </div>
            </div>

            {/* Monthly Progress */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Books Completed</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages Read</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Days</span>
                  <span className="font-medium">18/31</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating Given</span>
                  <span className="font-medium">4.2 ⭐</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyReading