import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [showLoginModal, setShowLoginModal] = useState(false)

  const login = (token) => {
    localStorage.setItem('token', token)
    setIsLoggedIn(true)
    setShowLoginModal(false)   // close modal automatically on successful login
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, showLoginModal, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}