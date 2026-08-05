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
      {/* Floating action button — Report Item */}
      <button
        onClick={() => navigate("/report")}
        className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-md z-50 rounded-t-xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${isActive ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

export default BottomNav