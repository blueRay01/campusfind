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
        <aside className="relative z-30 hidden min-h-[calc(100vh-90px)] w-24 shrink-0 border-r-2 border-ink bg-background lg:-mb-xxl lg:block">
          {/* Sticks below the navbar; items spread from top edge to bottom edge */}
          <nav
            className="sticky top-[90px] flex h-[calc(100vh-90px)] flex-col items-center justify-between py-lg"
            aria-label="Main"
          >
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

            {/* Report button */}
            <button
              type="button"
              onClick={() => navigate("/report")}
              className="group flex flex-col items-center gap-1.5"
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