import { createContext, useCallback, useContext, useRef, useState } from "react"
import { useAuth } from "./AuthContext"

const ToastContext = createContext(null)

const STYLES = {
  success: { box: "border-ink bg-lime text-ink", icon: "check_circle" },
  error: { box: "border-error bg-error-container text-on-error-container", icon: "error" },
  info: { box: "border-ink bg-surface-container-lowest text-ink", icon: "info" },
}

export function ToastProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts(list => list.filter(t => t.id !== id))
  }, [])

  // toast("Saved!")  |  toast("Something broke", "error")  |  toast("Logged out.", "info")
  const toast = useCallback((message, type = "success", duration = 3500) => {
    const id = ++nextId.current
    setToasts(list => [...list.slice(-2), { id, message, type }]) // show 3 at most
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* On phones: centered, above the bottom nav when logged in. On desktop: bottom right. */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 z-[80] flex flex-col items-center gap-sm px-md lg:inset-x-auto lg:bottom-lg lg:right-lg lg:items-end lg:px-0 ${
          isLoggedIn
            ? "bottom-[calc(160px+env(safe-area-inset-bottom))]"
            : "bottom-[calc(24px+env(safe-area-inset-bottom))]"
        }`}
      >
        {toasts.map(t => {
          const style = STYLES[t.type] || STYLES.success
          return (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              className={`toast-in pointer-events-auto flex max-w-full items-center gap-sm rounded-2xl border-2 py-sm pl-md pr-sm shadow-pop sm:max-w-md ${style.box}`}
            >
              <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                {style.icon}
              </span>
              <span className="font-button text-button">{t.message}</span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="ml-xs grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/10"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>")
  return toast
}