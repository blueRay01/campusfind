import { Link } from "react-router-dom"

// Shared split layout for the /login and /register pages:
// a violet brand panel on the left (desktop only) and the form on the right.
function AuthLayout({ children }) {
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen bg-background text-on-surface">

      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-[680px] shrink-0 flex-col justify-between overflow-hidden border-r-2 border-ink bg-violet p-xxl lg:flex">
        <Link to="/feed" className="relative z-10 flex items-center gap-sm self-start">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] border-2 border-ink bg-lime">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
          </span>
          <span className="font-display text-[22px] font-bold tracking-tight text-ink">CampusFind</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-[clamp(44px,4.6vw,72px)] font-bold leading-[0.98] tracking-[-0.035em] text-ink">
            Lost it?<br />
            <mark className="inline-block -rotate-[1.5deg] rounded-2xl border-2 border-ink bg-lime px-3 text-ink">Found it.</mark><br />
            Got it back.
          </h2>
          <p className="mt-lg max-w-[400px] text-[17px] leading-relaxed text-ink/80">
            One board for everything found around campus, pinned to the building where it turned up.
          </p>
        </div>

        <p className="relative z-10 font-body-sm text-body-sm text-ink/70">© {year} CampusFind. Made for students, by students.</p>

        {/* Decorations */}
        <svg viewBox="0 0 72 72" className="absolute right-xxl top-[18%] w-20" aria-hidden="true">
          <path d="M36 2 C39 26 46 33 70 36 C46 39 39 46 36 70 C33 46 26 39 2 36 C26 33 33 26 36 2Z" className="fill-lime stroke-ink" strokeWidth="2.5" />
        </svg>
        <svg viewBox="0 0 64 76" className="absolute bottom-[14%] right-[14%] w-16 rotate-12" aria-hidden="true">
          <path d="M32 2C16 2 3 15 3 31c0 21 29 43 29 43s29-22 29-43C61 15 48 2 32 2Z" className="fill-surface-container-lowest stroke-ink" strokeWidth="3" />
          <circle cx="32" cy="31" r="10" className="fill-lime stroke-ink" strokeWidth="3" />
        </svg>
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border-2 border-ink/20" aria-hidden="true" />
      </aside>

      {/* Form side */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Logo for phones / tablets (the brand panel is hidden there) */}
        <div className="flex items-center justify-between px-margin-mobile py-md md:px-8 lg:hidden">
          <Link to="/feed" className="flex items-center gap-sm">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] border-2 border-ink bg-lime">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </span>
            <span className="font-display text-[19px] font-bold tracking-tight text-ink">CampusFind</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-margin-mobile pb-xxl pt-md md:px-8 lg:py-xxl">
          {children}
        </div>

        <nav className="flex flex-wrap justify-center gap-x-lg gap-y-sm border-t-2 border-ink/10 px-margin-mobile py-md lg:justify-end lg:px-xxl" aria-label="Footer">
          {["Support", "Legal", "Privacy", "Contact"].map(link => (
            <a key={link} href="#" className="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-ink hover:underline underline-offset-4">
              {link}
            </a>
          ))}
        </nav>
      </main>
    </div>
  )
}

export default AuthLayout
