import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/navbar'
import Home from './pages/home'
import Login from './pages/login'
import { useUserData } from './hooks/useUserData'

function AppRoutes() {
  const user = useAuth()
  const data = useUserData(user?.uid)

  // Still loading auth state
  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home {...data} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
