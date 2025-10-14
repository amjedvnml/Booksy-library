import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const Landing = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-colors duration-300"
      style={{ 
        background: isDark 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      }}
    >
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full shadow-lg transition-all z-50"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Logo and Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <img 
                src="/BooksyLogosCorrect.png" 
                alt="Booksy Logo" 
                className="w-32 h-32 object-contain drop-shadow-2xl animate-bounce-slow"
              />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
            </div>
          </div>
          
          <h1 
            className="text-6xl md:text-7xl font-bold mb-4 animate-slide-up"
            style={{ 
              color: isDark ? 'white' : 'white',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            Booksy Library
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-2 animate-slide-up delay-100"
            style={{ 
              color: isDark ? '#cbd5e1' : 'rgba(255,255,255,0.95)',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Your Digital Reading Sanctuary
          </p>
          
          <p 
            className="text-lg md:text-xl animate-slide-up delay-200"
            style={{ 
              color: isDark ? '#94a3b8' : 'rgba(255,255,255,0.85)',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Discover, Read, and Organize Your Favorite Books
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl w-full animate-slide-up delay-300">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-2xl">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Vast Collection</h3>
            <p className="text-white/80 text-sm">
              Access thousands of books across all genres and categories
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-2xl">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Reading</h3>
            <p className="text-white/80 text-sm">
              Track your progress and get personalized recommendations
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-2xl">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Beautiful Experience</h3>
            <p className="text-white/80 text-sm">
              Modern interface designed for the perfect reading experience
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up delay-400">
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 hover:bg-indigo-50"
          >
            Sign In
          </button>
          
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
          >
            Create Account
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-center animate-slide-up delay-500">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">10,000+</div>
            <div className="text-white/70 text-sm">Books Available</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">5,000+</div>
            <div className="text-white/70 text-sm">Active Readers</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
            <div className="text-3xl font-bold text-white mb-1">4.9★</div>
            <div className="text-white/70 text-sm">User Rating</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-white/60 text-sm">
          Reading Club of Manhattan © 2025
        </p>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default Landing
