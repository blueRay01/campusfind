import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function SideBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const navItems = [
    { icon: "home", label: "Home", path: "/feed" },
    { icon: "list_alt", label: "My Posts", path: "/my-posts" },
    { icon: "inventory_2", label: "My Claims", path: "/my-claims" },
  ]

  return (
    <>
        {isLoggedIn && (
      <aside className={`hidden lg:flex flex-col h-[calc(100vh-64px)] fixed left-0 top-16 bg-surface text-on-surface border-r border-outline-variant pt-6 z-40 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>

      {/* Header */}
      <div className="px-6 mb-6 flex justify-between items-center">
        {!collapsed && (
          <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Menu</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[20px]">
            {collapsed ? "menu" : "menu_open"}
          </span>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${isActive ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
            >
              <span className={`material-symbols-outlined ${isActive ? "text-on-primary" : "group-hover:text-primary"} transition-colors`}>
                {item.icon}
              </span>
              {!collapsed && <span className="font-button text-button">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Report button */}
      <div className="p-4 border-t border-outline-variant/30">
        <button
          onClick={() => navigate("/report")}
          className={`bg-primary text-white py-3 rounded-xl font-button text-button hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm ${collapsed ? "w-12 mx-auto px-3" : "w-full"}`}
        >
          <span className="material-symbols-outlined">add</span>
          {!collapsed && <span>Report Item</span>}
        </button>
      </div>

    </aside>
    )

    }
    </>

    
  )
}

export default SideBar