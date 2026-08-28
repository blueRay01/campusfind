import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/feed?search=${encodeURIComponent(searchQuery.trim())}`) 
    }
  }

  return (
    <header className="bg-surface flex justify-between items-center w-full p-margin-desktop h-15 sticky top-0 z-50 absolute ">

      {/* Left group — logo + search, close together */}
      <div className="flex items-center gap-40 ml-24 flex-1">
        <span
          onClick={() => navigate("/feed")}
          className="text-headline-lg font-headline-md font-bold text-primary cursor-pointer"
        >
          CampusFind
        </span>

        <form onSubmit={handleSearch} className="flex items-center w-full max-w-3xl">
          <div className="relative w-4/5">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface rounded-full border border-black focus:ring-2 focus:ring-primary-container text-body-sm font-body-sm"
              placeholder="Search lost items..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      

      {/* Right — icons */}
      <div className="flex items-center gap-20 mr-20">
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
                <p className="p-2 cursor-pointer" onClick={() => {
                  logout()
                  navigate('/feed')
                }
                 
                  }>Logout</p>
              </div>
            )}
          </div>
          
        </>
      ) : (
        <>
          <button type="button" className="border border-black text-black-xs px-4 py-2 hover:bg-primary-container" onClick={() => {openAuthModal('register')}}>
            Sign Up   
          </button>
          <button type="button" className="bg-black text-white px-4 py-2 hover:bg-primary" onClick={() => {openAuthModal('login')}}>
            Log In
          </button>
        </>
      )}

        
      </div>

    </header>
  )
}

export default Navbar