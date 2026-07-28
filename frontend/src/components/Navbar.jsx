import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState, useRef, useEffect } from "react";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <header className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50">

      {/* Left — logo only */}
      <div className="flex items-center">
        <span
          onClick={() => navigate("/feed")}
          className="text-headline-md font-headline-md font-bold text-primary cursor-pointer"
        >
          CampusFind
        </span>
      </div>

      {/* Center — search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full border-none focus:ring-2 focus:ring-primary-container text-body-sm font-body-sm"
            placeholder="Search items, buildings..."
            type="text"
          />
        </div>
      </div>

      {/* Right — icons */}
      <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200 active:opacity-80">
            <span className="material-symbols-outlined">notifications</span>
          </button>
            <div className="relative" ref={dropdownRef}>
              <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200 active:opacity-80"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            {isOpen && (
              <div className="absolute flex flex-col justify-center bg-gray-200 rounded-md">
                <p className="p-2 cursor-pointer" onClick={() => navigate('/profile')}>Profile</p>
                <p className="p-2 cursor-pointer" onClick={() => logout()}>Logout</p>
              </div>
            )}
          </div>
          
        </>
      ) : (
        <>
          <button type="button" className="rounded-xl bg-on-primary-fixed text-white p-2 hover:bg-primary-container" onClick={() => {openAuthModal('register')}}>
            Sign Up
          </button>
          <button type="button" className="rounded-xl bg-gray-200 p-2 hover:bg-gray-300" onClick={() => {openAuthModal('login')}}>
            Log In
          </button>
        </>
      )}

        
      </div>

    </header>
  )
}

export default NavBar