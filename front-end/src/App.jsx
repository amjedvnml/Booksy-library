import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideBar from "./components/SideBar/SideBar";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SideBar />} />
      </Routes>
    </Router>
  )
}

export default App