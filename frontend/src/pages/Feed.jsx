import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import ItemCard from "../components/ItemCard"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"


const categories = [
  "All Items",
  "Electronics",
  "Water Bottles",
  "Wallets / IDs",
  "Clothing / Apparel",
  "Books / Notebooks",
  "Keys",
  "Other",
]

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
]

const steps = [
  { title: "Snap it", text: "Found something? Take a photo and add what it is. It takes about a minute." },
  { title: "Pin it", text: "Tag the building and room, or note that you handed it to security." },
  { title: "Reunite", text: "The owner spots it on the feed, claims it, and picks it up." },
]

// Shared page padding (the sidebar sits beside the content, so no extra offset is needed)
const pagePad = "px-margin-mobile md:px-8 lg:px-12"


/* ---------- small decorative pieces ---------- */

function Sparkle({ className = "", filled = true }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden="true">
      <path
        d="M36 2 C39 26 46 33 70 36 C46 39 39 46 36 70 C33 46 26 39 2 36 C26 33 33 26 36 2Z"
        className={filled ? "fill-violet stroke-ink" : "fill-none stroke-ink"}
        strokeWidth={filled ? 2.5 : 4}
      />
    </svg>
  )
}

function PinDoodle({ className = "" }) {
  return (
    <svg viewBox="0 0 64 76" className={className} aria-hidden="true">
      <path d="M32 2C16 2 3 15 3 31c0 21 29 43 29 43s29-22 29-43C61 15 48 2 32 2Z" className="fill-surface-container-lowest stroke-ink" strokeWidth="3" />
      <circle cx="32" cy="31" r="10" className="fill-lime stroke-ink" strokeWidth="3" />
    </svg>
  )
}

// A tilted mini item card for the hero collage
function MiniCard({ post, fallback, className = "", tint }) {
  const title = post?.title || fallback.title
  const place = post ? post.building : fallback.place
  const category = post?.category || fallback.category

  return (
    <div className={`absolute rounded-[18px] border-2 border-ink bg-surface-container-lowest p-[2.5%] shadow-pop ${className}`}>
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[12px] ${tint}`}>
        {post?.image_url ? (
          <img src={post.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center">
            <span className="material-symbols-outlined text-[40px] text-ink/40">{fallback.icon}</span>
          </div>
        )}
        <span className="absolute left-2 top-2 max-w-[85%] truncate rounded-full border-2 border-ink bg-surface-container-lowest px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          {category}
        </span>
      </div>
      <p className="mt-2 truncate font-display text-[clamp(13px,1.6vw,19px)] font-semibold leading-tight">{title}</p>
      <p className="truncate text-[clamp(10px,1vw,12.5px)] text-on-surface-variant">{place}</p>
    </div>
  )
}


function Feed() {
  const { isLoggedIn, openAuthModal } = useAuth()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [sortBy, setSortBy] = useState("newest")
  const [posts, setPosts] = useState([])


  const visiblePosts = posts
    .filter(post => !post.is_claimed)
    .filter(post => activeCategory === "All Items" || post.category === activeCategory)
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts')
        setPosts(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error('Could not load posts', err)
        setPosts([])
      }
    }
    fetchPosts()
  }, [isLoggedIn])

  // Display-only numbers, worked out from the posts already loaded
  const openPosts = posts.filter(post => !post.is_claimed)
  const buildings = [...new Set(openPosts.map(post => post.building).filter(Boolean))]
  const latest = [...openPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const showLanding = !isLoggedIn && !searchQuery


 return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-on-surface">

      <Navbar />

      <div className="flex flex-1">
        <SideBar />

        <main className={`flex-1 min-w-0 ${pagePad} pt-xl lg:pt-xxl`}>
          <div className="max-w-[1680px]">

            {/* ---------- Landing hero (logged-out visitors only) ---------- */}
            {showLanding && (
              <>
                <section className="grid items-center gap-xxl pb-xxl lg:grid-cols-[1.05fr_1fr] lg:pb-[72px]">
                  <div>
                    <span className="inline-flex items-center gap-sm rounded-full border-2 border-ink bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-lime" />
                      The campus lost and found board
                    </span>

                    <h1 className="mt-lg font-display text-[clamp(44px,6.4vw,82px)] font-bold leading-[0.98] tracking-[-0.035em] text-ink">
                      Found something? Someone's{" "}
                      <mark className="inline-block -rotate-[1.5deg] rounded-2xl border-2 border-ink bg-lime px-3 text-ink">
                        looking for it.
                      </mark>
                    </h1>

                    <p className="mt-lg max-w-[480px] text-[17px] leading-relaxed text-on-surface-variant md:text-[18px]">
                      CampusFind is one board for everything found around campus. Every post is pinned to a
                      building and room, so owners know exactly where to look.
                    </p>

                    <div className="mt-xl flex flex-wrap items-center gap-md">
                      <button
                        type="button"
                        onClick={() => openAuthModal('register')}
                        className="inline-flex h-12 items-center gap-sm rounded-full border-2 border-ink bg-lime px-lg font-button text-button shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0 active:shadow-none"
                      >
                        Post a found item
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </button>
                      <a
                        href="#feed"
                        className="inline-flex h-12 items-center rounded-full border-2 border-ink bg-surface-container-lowest px-lg font-button text-button transition-colors hover:bg-violet-soft"
                      >
                        Browse the feed
                      </a>
                    </div>

                    {openPosts.length > 0 && (
                      <div className="mt-xl flex flex-wrap gap-sm font-body-sm text-body-sm">
                        <span className="rounded-lg border-2 border-ink bg-violet px-3 py-1 font-semibold">
                          {openPosts.length} item{openPosts.length === 1 ? "" : "s"} waiting
                        </span>
                        {buildings.length > 0 && (
                          <span className="rounded-lg border-2 border-ink bg-surface-container-lowest px-3 py-1 font-semibold">
                            across {buildings.length} building{buildings.length === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Collage */}
                  <div className="relative mx-auto aspect-[6/5] w-full max-w-[580px]" aria-hidden="true">
                    <div className="absolute left-0 top-0 h-[22%] w-[26%] rounded-2xl border-2 border-dashed border-ink" />
                    <div className="absolute bottom-[4%] left-[10%] right-[3%] top-[6%] rotate-3 rounded-[32px] border-2 border-ink bg-violet" />

                    <MiniCard
                      post={latest[0]}
                      fallback={{ title: "Black gel pen", place: "Arts and Culture Building", category: "Books / Notebooks", icon: "edit" }}
                      tint="bg-lime-soft"
                      className="left-[16%] top-[13%] w-[44%] -rotate-6"
                    />
                    <MiniCard
                      post={latest[1]}
                      fallback={{ title: "AirPods case", place: "Main Library", category: "Electronics", icon: "headphones" }}
                      tint="bg-violet-soft"
                      className="left-[52%] top-[30%] w-[44%] rotate-[5deg]"
                    />

                    <span className="absolute left-[56%] top-[8%] rounded-[16px_16px_16px_4px] border-2 border-ink bg-ink px-3 py-2 text-[clamp(11px,1.2vw,14px)] font-semibold text-background">
                      that's mine!!
                    </span>
                    <Sparkle className="absolute right-0 top-0 w-[12%]" />
                    <Sparkle className="absolute bottom-[8%] left-[6%] w-[7%]" filled={false} />
                    <PinDoodle className="absolute bottom-[1%] left-[44%] w-[10%]" />
                  </div>
                </section>

                {/* Building strip (only shows buildings that have posts) */}
                {buildings.length > 0 && (
                  <div className="mb-xxl flex flex-col gap-sm overflow-hidden rounded-[22px] border-2 border-ink bg-surface-container-lowest px-lg py-md shadow-pop sm:flex-row sm:items-center sm:gap-lg">
                    <span className="shrink-0 font-body-sm text-body-sm font-semibold leading-tight text-on-surface-variant">
                      Pinned to buildings<br className="hidden sm:block" /> across campus
                    </span>
                    <div className="flex min-w-0 gap-sm overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {buildings.map(building => (
                        <span key={building} className="flex shrink-0 items-center gap-1 rounded-full bg-background px-md py-2 font-body-sm text-body-sm font-semibold">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {building}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ---------- The feed ---------- */}
            <section
              id="feed"
              className="scroll-mt-28 rounded-[28px] border-2 border-ink bg-surface-container-lowest p-md sm:p-xl lg:rounded-[36px] lg:p-xxl"
            >
              <div className="flex flex-wrap items-end justify-between gap-md">
                <div>
                  <h2 className="font-display text-[clamp(44px,7vw,84px)] font-bold leading-[0.9] tracking-[-0.04em] text-ink">
                    {searchQuery ? "Results" : "The feed"}
                  </h2>
                  {searchQuery && (
                    <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
                      for "<span className="text-ink">{searchQuery}</span>"{" "}
                      <Link to="/feed" className="ml-sm font-body-sm text-body-sm text-ink underline underline-offset-4">
                        Clear search
                      </Link>
                    </p>
                  )}
                </div>
                <p className="flex items-center gap-sm text-base text-on-surface-variant">
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-lime" />
                  {visiblePosts.length} item{visiblePosts.length === 1 ? "" : "s"} on the board
                </p>
              </div>

              {/* Filters: category pills + sort */}
              <div className="mt-xl flex flex-col gap-md lg:flex-row lg:items-center lg:justify-between">
                <div
                  role="tablist"
                  aria-label="Category"
                  className="-mx-md flex gap-sm overflow-x-auto px-md pb-1 sm:-mx-xl sm:px-xl lg:mx-0 lg:flex-wrap lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {categories.map(cat => {
                    const active = activeCategory === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveCategory(cat)}
                        className={`h-12 shrink-0 rounded-full border-2 px-lg text-base font-medium transition-all ${
                          active
                            ? "border-ink bg-lime font-bold shadow-pop-sm"
                            : "border-ink/20 hover:border-ink"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>

                <label className="relative shrink-0 self-start lg:self-auto">
                  <span className="sr-only">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-12 appearance-none rounded-full border-2 border-ink bg-surface-container-lowest pl-lg pr-11 text-base font-semibold outline-none focus:ring-4 focus:ring-lime/60"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px]">
                    expand_more
                  </span>
                </label>
              </div>

              {/* Cards grid */}
              {visiblePosts.length > 0 ? (
                <div className="mt-xl grid grid-cols-2 gap-x-md gap-y-xl sm:gap-x-lg lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {visiblePosts.map(post => (
                    <ItemCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      location={`${post.building}${post.room ?`, ${post.room}` : ''}`}
                      category={post.category}
                      image={post.image_url}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-xl flex flex-col items-center rounded-[22px] border-2 border-dashed border-ink/30 px-lg py-xxl text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-violet-soft">
                    <span className="material-symbols-outlined text-[32px]">search_off</span>
                  </span>
                  <h3 className="mt-md font-headline-md text-headline-md">Nothing here yet</h3>
                  <p className="mt-xs max-w-sm font-body-sm text-body-sm text-on-surface-variant">
                    {searchQuery || activeCategory !== "All Items"
                      ? "Try another category or a different search."
                      : "When someone posts a found item, it'll show up here."}
                  </p>
                </div>
              )}
            </section>

            {/* ---------- How it works (logged-out visitors only) ---------- */}
            {showLanding && (
              <section className="relative mt-xxl overflow-hidden rounded-[28px] bg-ink px-lg py-xxl text-background lg:rounded-[36px] lg:px-xxl lg:py-[72px]">
                <Sparkle className="absolute -right-4 -top-4 w-20 opacity-90 lg:w-28" />
                <h2 className="mx-auto max-w-2xl text-center font-display text-[clamp(32px,4.4vw,54px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  From "where did it go" to "got it back"
                </h2>
                <p className="mx-auto mt-md w-max max-w-full rounded-md bg-lime px-md py-1 text-center font-body-lg text-body-lg font-semibold text-ink">
                  Three steps, no group chat needed
                </p>

                <div className="mt-xxl grid gap-md md:grid-cols-3 md:gap-lg">
                  {steps.map((step, i) => (
                    <div key={step.title} className="rounded-[22px] border-2 border-background/20 bg-background/5 p-lg">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet font-display text-[20px] font-bold text-ink">
                        {i + 1}
                      </span>
                      <h3 className="mt-lg font-display text-[26px] font-semibold">{step.title}</h3>
                      <p className="mt-sm leading-relaxed text-background/70">{step.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-xxl flex justify-center">
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className="inline-flex h-12 items-center gap-sm rounded-full border-2 border-background bg-lime px-lg font-button text-button text-ink transition-transform hover:-translate-y-0.5"
                  >
                    Create a free account
                  </button>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>

      <Footer />
      <BottomNav />

    </div>
  )
}

export default Feed