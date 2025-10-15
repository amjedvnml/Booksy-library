import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SideBar from "./components/SideBar/SideBar"
import Header from "./components/Header/Header"
import Landing from "./pages/Landing/Landing"
import LibraryMain from "./pages/Home/LibraryMain"
import Library from "./pages/Library/Library"
import WishLists from "./pages/WishLists/WishLists"
import MyReading from "./pages/MyReading/MyReading"
import Settings from "./pages/Settings/Settings"
import RightSidebar from "./components/RightSidebar/RightSidebar"
import SignIn from "./pages/Auth/SignIn"
import Register from "./pages/Auth/Register"
import Admin from "./pages/Admin/Admin"
import Reader from "./pages/Reader/Reader"

const MainLayout = ({ children }) => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  
  // Hide right sidebar on certain pages
  const hideRightSidebar = ['/settings', '/wish-lists'].includes(location.pathname)
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-800 overflow-hidden transition-colors">
      {/* Left Sidebar */}
      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Right Sidebar - conditionally rendered */}
      {!hideRightSidebar && <RightSidebar />}
    </div>
  )
}

const AppContent = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <LibraryMain />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/library" element={
            <ProtectedRoute>
              <MainLayout>
                <Library />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/wish-lists" element={
            <ProtectedRoute>
              <MainLayout>
                <WishLists />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/my-reading" element={
            <ProtectedRoute>
              <MainLayout>
                <MyReading />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Reader Route - Full screen without layout */}
          <Route path="/reader/:bookId" element={
            <ProtectedRoute>
              <Reader />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App