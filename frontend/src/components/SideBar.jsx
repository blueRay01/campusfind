import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const navItems = [
    { icon: "home", label: "Home", path: "/feed", matches: ["/feed", "/item"] },
    { icon: "list_alt", label: "My Posts", path: "/my-posts", matches: ["/my-posts", "/report"] },
    { icon: "inventory_2", label: "My Claims", path: "/my-claims", matches: ["/my-claims"] },
  ]

  return (
    <>
      {isLoggedIn && (
        <aside className="hidden lg:flex flex-col items-center h-[calc(100vh-100px)] fixed left-0 top-[100px] w-20 bg-surface text-on-surface pt-6 z-40">

          {/* Nav links */}
          <nav className="flex-1 flex flex-col items-center gap-20 pt-4 mt-20">
            {navItems.map((item) => {
              const isActive = item.matches.some(prefix => location.pathname.startsWith(prefix))
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 text-on-surface hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[30px]">
                    {item.icon}
                  </span>
                  <span className={`h-[2px] w-5 rounded-full transition-all ${isActive ? "bg-primary" : "bg-transparent"}`} />
                </button>
              )
            })}
          </nav>

          {/* Report button */}
          <div className="pb-8">
            <button
              onClick={() => navigate("/report")}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                location.pathname.startsWith("/report")
                  ? "bg-black border border-black"
                  : "border border-outline hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined ${location.pathname.startsWith("/report") ? "text-white" : ""}`}>
                add
              </span>
            </button>
          </div>

        </aside>
      )}
    </>
  )
}

export default SideBar