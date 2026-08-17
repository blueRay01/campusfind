import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [authMode, setAuthMode] = useState(null)

  const login = (token) => {
    localStorage.setItem('token', token)
    setIsLoggedIn(true)
    setAuthMode(null)   // close modal automatically on successful login
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
  }

  const closeAuthModal = () => setAuthMode(null)

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, authMode, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}