import { useNavigate, useLocation } from "react-router-dom"

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: "home", label: "Feed", path: "/feed" },
    { icon: "search", label: "Search", path: "/search" },
    { icon: "add_box", label: "Report", path: "/report" },
    { icon: "person", label: "Profile", path: "/profile" },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-md z-50 rounded-t-xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${isActive ? "bg-primary text-white" : "text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav