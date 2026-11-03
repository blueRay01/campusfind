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
    <header className="sticky top-0 z-50 w-full border-b-2 border-ink bg-background/90 backdrop-blur-md">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-sm sm:gap-x-md gap-y-sm px-margin-mobile md:px-8 lg:px-12 py-sm lg:py-0 lg:h-[88px]">

        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="flex items-center gap-sm shrink-0 rounded-full"
        >
          <span className="grid place-items-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-lime border-2 border-ink">
            <span className="material-symbols-outlined text-[22px] sm:text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              location_on
            </span>
          </span>
          <span className="font-display text-[21px] sm:text-[26px] font-bold tracking-tight text-ink">CampusFind</span>
        </button>

        {/* Search: full-width second row on mobile, inline on desktop */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="order-last w-full lg:order-none lg:w-auto lg:flex-1 lg:max-w-2xl lg:ml-xl"
        >
          <label className="relative block">
            <span className="sr-only">Search items</span>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[24px] text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              className="w-full h-12 pl-12 pr-5 rounded-full border-2 border-ink bg-surface-container-lowest text-base placeholder:text-on-surface-variant outline-none focus:ring-4 focus:ring-lime/60 transition"
              placeholder="Search found items..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </form>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-xs sm:gap-sm">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                aria-label="Notifications"
                className="grid place-items-center w-12 h-12 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[30px]">notifications</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-label="Account menu"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(!isOpen)}
                  className={`grid place-items-center w-12 h-12 rounded-full border-2 transition-colors active:scale-95 ${
                    isOpen ? "bg-lime border-ink" : "border-transparent hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[30px]">account_circle</span>
                </button>

                {isOpen && (
                  <div className="absolute right-0 top-full mt-sm w-56 overflow-hidden rounded-2xl border-2 border-ink bg-surface-container-lowest shadow-pop">
                    <button
                      type="button"
                      className="flex w-full items-center gap-sm px-md py-3 text-left font-body-sm text-body-sm hover:bg-lime-soft"
                      onClick={() => {
                        setIsOpen(false)
                        navigate('/profile')
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      Profile
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-sm px-md py-3 text-left font-body-sm text-body-sm border-t-2 border-ink/10 hover:bg-lime-soft"
                      onClick={() => {
                        setIsOpen(false)
                        logout()
                        navigate('/feed')
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="h-10 px-4 sm:h-12 sm:px-lg rounded-full border-2 border-ink font-button font-semibold text-[14px] sm:text-button hover:bg-surface-container-lowest transition-colors"
                onClick={() => { openAuthModal('register') }}
              >
                Sign Up
              </button>
              <button
                type="button"
                className="h-10 px-4 sm:h-12 sm:px-lg rounded-full border-2 border-ink bg-lime font-button font-semibold text-[14px] sm:text-button shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0 active:shadow-none"
                onClick={() => { openAuthModal('login') }}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar