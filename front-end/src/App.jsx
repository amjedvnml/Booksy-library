import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SideBar from "./components/SideBar/SideBar"
import Header from "./components/Header/Header"
import LibraryMain from "./pages/Home/LibraryMain"
import Library from "./pages/Library/Library"
import WishLists from "./pages/WishLists/WishLists"
import MyReading from "./pages/MyReading/MyReading"
import Settings from "./pages/Settings/Settings"
import RightSidebar from "./components/RightSidebar/RightSidebar"
import SignIn from "./pages/Auth/SignIn"
import Register from "./pages/Auth/Register"
import Admin from "./pages/Admin/Admin"

const MainLayout = ({ children }) => {
  const location = useLocation()
  
  // Hide right sidebar on certain pages
  const hideRightSidebar = ['/settings', '/wish-lists'].includes(location.pathname)
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <SideBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
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
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App