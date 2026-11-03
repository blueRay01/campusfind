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

  const onReport = location.pathname.startsWith("/report")

  return (
    <>
      {isLoggedIn && (
        <aside className="hidden lg:flex flex-col items-center fixed left-0 top-[82px] h-[calc(100vh-82px)] w-20 z-40 border-r-2 border-ink bg-background py-lg">

          {/* Nav links */}
          <nav className="flex-1 flex flex-col items-center gap-md pt-md" aria-label="Main">
            {navItems.map((item) => {
              const isActive = item.matches.some(prefix => location.pathname.startsWith(prefix))
              return (
                <button
                  key={item.label}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => navigate(item.path)}
                  className={`grid place-items-center w-12 h-12 rounded-2xl border-2 transition-all ${
                    isActive
                      ? "bg-lime border-ink shadow-pop-sm"
                      : "border-transparent text-on-surface-variant hover:text-ink hover:bg-surface-container-high"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Report button */}
          <button
            type="button"
            title="Report a found item"
            aria-label="Report a found item"
            onClick={() => navigate("/report")}
            className={`grid place-items-center w-12 h-12 rounded-full border-2 border-ink transition-all ${
              onReport
                ? "bg-ink text-lime"
                : "bg-violet shadow-pop-sm hover:-translate-y-0.5 hover:shadow-pop"
            }`}
          >
            <span className="material-symbols-outlined">add</span>
          </button>

        </aside>
      )}
    </>
  )
}

export default SideBar
