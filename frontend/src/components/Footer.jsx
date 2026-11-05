import { useAuth } from "../context/AuthContext"

function Footer() {
  const links = ["Support", "Legal", "Privacy", "Contact"]
  const year = new Date().getFullYear()
  const { isLoggedIn } = useAuth()

  // Logged-in pages work like an app: no footer, only the content scrolls
  if (isLoggedIn) return null

  return (
    <footer className="relative z-10 mt-xxl border-t-2 border-ink bg-background px-margin-mobile md:px-8 lg:px-12 pt-xl pb-32 lg:pb-lg overflow-hidden">
      <p
        aria-hidden="true"
        className="font-display font-extrabold text-ink leading-[0.9] pb-2 tracking-[-0.05em] text-[clamp(48px,8vw,128px)] select-none"
      >
        CampusFind
      </p>

      <div className="mt-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © {year} CampusFind. Made for students, by students.
        </p>
        <nav className="flex flex-wrap gap-x-lg gap-y-sm" aria-label="Footer">
          {links.map(link => (
            <a
              key={link}
              href="#"
              className="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-ink hover:underline underline-offset-4"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer