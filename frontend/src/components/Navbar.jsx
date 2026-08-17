import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState, useRef, useEffect } from "react";

function NavBar() {
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
    <header className="bg-surface flex justify-between items-center w-full pl-[150px] pr-[120px] min-h-[100px] sticky top-0 z-50 ">
      {/* Left group — logo + search, close together */}
      <div className="flex items-center gap-40 flex-1">
        <span
          onClick={() => navigate("/feed")}
          className="font-headline-lg text-headline-lg text-primary cursor-pointer"
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
          <button className="p-2 hover:bg-surface-container-high transition-colors duration-200 active:opacity-80">
            <span className="material-symbols-outlined text-[30px]">notifications</span>
          </button>
            <div className="relative" ref={dropdownRef}>
              <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-surface-container-high transition-colors duration-200 active:opacity-80"
            >
              <span className="material-symbols-outlined text-[30px]">account_circle</span>
            </button>
            {isOpen && (
              <div className="absolute flex flex-col justify-center bg-background border border-black">
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

export default NavBar