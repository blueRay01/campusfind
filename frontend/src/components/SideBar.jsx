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
        <aside id="app-sidebar" className="relative z-30 hidden w-24 shrink-0 border-r-2 border-ink bg-background lg:block">
          {/* Sticks below the navbar */}
          <nav
            className="flex h-full flex-col items-center py-lg"
            aria-label="Main"
          >
            {/* Main links, grouped in the middle */}
            <div className="flex flex-1 flex-col items-center justify-center gap-xl">
              {navItems.map((item) => {
                const isActive = item.matches.some(prefix => location.pathname.startsWith(prefix))
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => navigate(item.path)}
                    className={`flex w-[76px] flex-col items-center gap-1 rounded-2xl border-2 py-2 transition-all ${
                      isActive
                        ? "border-ink bg-lime text-ink shadow-pop-sm"
                        : "border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-ink"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[12px] font-semibold leading-none">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Report button, pinned to the bottom */}
            <button
              type="button"
              onClick={() => navigate("/report")}
              className="group flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-full border-2 border-ink transition-all ${
                  onReport
                    ? "bg-ink text-lime"
                    : "bg-violet shadow-pop-sm group-hover:-translate-y-0.5 group-hover:shadow-pop"
                }`}
              >
                <span className="material-symbols-outlined text-[30px]">add</span>
              </span>
              <span className="text-[12px] font-semibold leading-none text-ink">Report</span>
            </button>
          </nav>
        </aside>
      )}
    </>
  )
}

export default SideBar