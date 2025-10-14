import React, { useState } from 'react'
import { BookCard } from '../../components/BookCard/BookCard'

const WishLists = () => {
  const [activeList, setActiveList] = useState('to-read')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListName, setNewListName] = useState('')

  const wishLists = [
    {
      id: 'to-read',
      name: 'Want to Read',
      description: 'Books I plan to read soon',
      count: 12,
      color: 'bg-blue-500',
      books: [
        {
          title: "The Metamorphosis",
          author: "Franz Kafka",
          rating: "4.1",
          pages: "96",
          gradient: "from-gray-600 to-gray-800"
        },
        {
          title: "One Hundred Years of Solitude",
          author: "Gabriel García Márquez", 
          rating: "4.5",
          pages: "417",
          gradient: "from-yellow-600 to-orange-600"
        },
        {
          title: "The Stranger",
          author: "Albert Camus",
          rating: "4.0",
          pages: "123",
          gradient: "from-indigo-600 to-blue-600"
        }
      ]
    },
    {
      id: 'philosophy',
      name: 'Philosophy Collection',
      description: 'Essential philosophical works',
      count: 8,
      color: 'bg-purple-500',
      books: [
        {
          title: "Being and Time",
          author: "Martin Heidegger",
          rating: "4.3",
          pages: "589",
          gradient: "from-purple-600 to-indigo-600"
        },
        {
          title: "Critique of Pure Reason",
          author: "Immanuel Kant",
          rating: "4.2",
          pages: "785",
          gradient: "from-blue-600 to-purple-600"
        }
      ]
    },
    {
      id: 'sci-fi',
      name: 'Science Fiction',
      description: 'Futuristic and speculative fiction',
      count: 15,
      color: 'bg-green-500',
      books: [
        {
          title: "Dune",
          author: "Frank Herbert",
          rating: "4.6",
          pages: "688",
          gradient: "from-orange-600 to-red-600"
        },
        {
          title: "Foundation",
          author: "Isaac Asimov",
          rating: "4.4",
          pages: "244",
          gradient: "from-blue-600 to-cyan-600"
        },
        {
          title: "Neuromancer",
          author: "William Gibson",
          rating: "4.2",
          pages: "271",
          gradient: "from-green-600 to-teal-600"
        }
      ]
    },
    {
      id: 'favorites',
      name: 'All-Time Favorites',
      description: 'Books that changed my perspective',
      count: 6,
      color: 'bg-red-500',
      books: [
        {
          title: "The Brothers Karamazov",
          author: "Fyodor Dostoevsky",
          rating: "4.7",
          pages: "824",
          gradient: "from-red-600 to-pink-600"
        }
      ]
    }
  ]

  const activeListData = wishLists.find(list => list.id === activeList)

  const createNewList = () => {
    if (newListName.trim()) {
      // In a real app, this would make an API call
      console.log('Creating new list:', newListName)
      setNewListName('')
      setShowCreateModal(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">Wish Lists</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">Organize books you want to read by categories</p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base whitespace-nowrap self-start sm:self-auto"
        >
          + Create List
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Lists Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">My Lists</h3>
            
            {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {wishLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => setActiveList(list.id)}
                  className={`flex-shrink-0 lg:flex-shrink lg:w-full text-left p-3 sm:p-4 rounded-lg transition-all min-w-[200px] sm:min-w-[220px] lg:min-w-0 ${
                    activeList === list.id 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700' 
                      : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${list.color} flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base truncate">{list.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{list.count} books</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 sm:mt-2 line-clamp-1">{list.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6 mt-4 sm:mt-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Statistics</h3>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Total Lists</span>
                <span className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{wishLists.length}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Total Books</span>
                <span className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{wishLists.reduce((sum, list) => sum + list.count, 0)}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Largest List</span>
                <span className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">{Math.max(...wishLists.map(list => list.count))} books</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeListData && (
            <>
              {/* List Header */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6 mb-4 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${activeListData.color} flex-shrink-0`}></div>
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">{activeListData.name}</h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 line-clamp-1">{activeListData.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300">
                      {activeListData.count} books
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 p-1">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {activeListData.books.map((book, index) => (
                  <div key={index} className="relative group">
                    <BookCard book={book} />
                    
                    {/* Remove from list button */}
                    <button className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    {/* Move to another list - Hide on mobile */}
                    <div className="hidden sm:block absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="bg-white dark:bg-slate-800 shadow-lg text-gray-600 dark:text-slate-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Book Card */}
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer group min-h-[200px] sm:min-h-[250px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Add Book</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New List</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">List Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={createNewList}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WishLists