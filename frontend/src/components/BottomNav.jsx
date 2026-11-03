import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const navItems = [
    { icon: "home", label: "Home", path: "/feed" },
    { icon: "list_alt", label: "My Posts", path: "/my-posts" },
    { icon: "inventory_2", label: "My Claims", path: "/my-claims" },
    { icon: "person", label: "Profile", path: "/profile" },
  ]

  if (!isLoggedIn) return null

  return (
    <>
      {/* Floating action button: Report Item */}
      <button
        type="button"
        aria-label="Report a found item"
        onClick={() => navigate("/report")}
        className="lg:hidden fixed right-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-50 grid place-items-center w-14 h-14 rounded-full bg-lime border-2 border-ink shadow-pop transition-transform active:scale-95"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <nav
        aria-label="Main"
        className="lg:hidden fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-50 flex justify-around items-center p-1.5 rounded-full border-2 border-ink bg-surface-container-lowest shadow-pop"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.label}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] px-3 py-1.5 rounded-full transition-colors duration-200 ${
                isActive ? "bg-lime text-ink" : "text-on-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

export default BottomNav
