import React, { useState } from 'react'

const SideBar = () => {
  const [activeTab, setActiveTab] = useState('Books')
  const [activeNav, setActiveNav] = useState('Library')

  const tabs = ['Books', 'Audiobooks', 'Podcasts']
  
  const navigationItems = [
    { name: 'Library' },
    { name: 'Favorites'  },
    { name: 'Lists' },
    { name: 'Reading' },
    { name: 'Settings' },
    { name: 'Support' },
    { name: 'Log Out'}
  ]

  return (
    <div className="w-80 h-screen bg-gradient-to-br from-emerald-800 via-teal-900 to-cyan-900 text-white flex flex-col">
      {/* Header Tabs */}
      <div className="p-6 border-b border-white/10">
        <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-white text-emerald-900 shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            MD
          </div>
          <div>
            <h3 className="font-semibold text-lg">Max Defrance</h3>
            <p className="text-white/60 text-sm">For you</p>
          </div>
        </div>
        
        {/* Reading Stats */}
        <div className="mt-4 bg-white/5 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300">12</div>
              <div className="text-white/60">Books Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-300">24</div>
              <div className="text-white/60">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-300">8</div>
              <div className="text-white/60">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNav(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeNav === item.name
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="font-medium text-center">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SideBar