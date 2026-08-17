import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function ItemDetail() {
  const navigate = useNavigate()
  const { isLoggedIn, openAuthModal } = useAuth()
  const { id } = useParams()
  const [claimed, setClaimed] = useState(false)
  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  const DESCRIPTION_LIMIT = 220
  const isLongDescription = post.description && post.description.length > DESCRIPTION_LIMIT
  const displayedDescription =
    isLongDescription && !descExpanded
      ? post.description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "…"
      : post.description

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`)
        setPost(response.data)
        setClaimed(response.data.is_claimed)
      } catch (err) {
        setError("Failed to load this item. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleClaim = async () => {
    try {
      if (isLoggedIn) {
        await api.post('/claims', { post_id: id })
        setClaimed(true)
      } else {
        openAuthModal('login')
      }
    } catch (err) {
      setError("Failed to claim this item. Please try again.")
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <NavBar />

      <div className="flex">
        <SideBar/>

        <main className="flex-1 py-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300">
          <div>

            

            {/* Main split: image left, details right */}
            <div className="flex flex-col lg:flex-row gap-40 pl-[150px]">

              {/* Left — image */}
              <div className="w-full lg:w-[40%] shrink-0 flex flex-row items-start gap-lg">
                {/* Back button */}
                <button
                  onClick={() => navigate("/feed")}
                  className="flex items-center text-on-surface-variant hover:text-primary transition-colors group mb-xl"
                >
                  <span className="material-symbols-outlined mr-xs text-[30px] group-hover:-translate-x-1 transition-transform">chevron_left</span>
                </button>

                <div
                  onClick={() => setLightboxOpen(true)}
                  className="group relative h-72 lg:h-[500px] w-full overflow-hidden cursor-zoom-in bg-surface-container-high border border-black"
                >
                  <img
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    src={post.image_url}
                  />
                  {/* Hover overlay signaling the image is clickable */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-xs px-md py-sm rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                      <span className="font-button text-button">View full size</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — details */}
              <div className="flex-1 flex flex-col">

                <span className="text-black/60 font-body-sm mb-sm">
                  {post.category} · FOUND
                </span>

                <h1 className="font-headline-lg text-headline-lg text-black uppercase mb-md">
                  {post.title}
                </h1>

                <p className="text-black/60 font-body-sm mb-xl">
                  Found on {formatDate(post.created_at)}
                </p>

                {post.description && (
                  <div className="mb-xl">
                    <h3 className="font-body-sm text-black/60 mb-sm">Description</h3>
                    <p className="text-black font-body-lg leading-relaxed whitespace-pre-line">
                      {displayedDescription}
                    </p>
                    {isLongDescription && (
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-sm font-button text-button text-black/70 hover:text-black underline underline-offset-2 transition-colors"
                      >
                        {descExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}

                {/* Location + reporter — plain rows, no card */}
                <div className="flex flex-col gap-lg mb-xl">
                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-black/60 text-[20px] mt-[2px]">location_on</span>
                    <div>
                      <p className="font-body-sm text-black mb-xs">Found at</p>
                      <p className="font-headline-md text-headline-md text-black">{post.building}</p>
                      {post.room && <p className="text-black/60 font-body-sm">{post.room}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-md">
                    <span className="material-symbols-outlined text-black/60 text-[20px] mt-[2px]">person</span>
                    <div>
                      <p className="font-body-sm text-black mb-xs">Reported by</p>
                      <p className="font-headline-md text-headline-md text-black">{post.reporter_name}</p>
                      <p className="text-black/60 font-body-sm">Verified Student Finder</p>
                    </div>
                  </div>
                </div>

                <hr className="border-outline-variant mb-xl" />

                {/* Status */}
                <div className="flex items-center gap-md mb-lg">
                  <div className={`h-3 w-3 rounded-full ${post.is_resolved ? "bg-secondary" : "bg-primary animate-pulse"}`}></div>
                  <span className="font-headline-md text-headline-md text-black">
                    {post.is_resolved ? "Resolved" : claimed ? "Pending Confirmation" : "Awaiting Claim"}
                  </span>
                </div>

                {/* Claim button — icon-led, modern pill */}
                <button
                  onClick={handleClaim}
                  disabled={claimed}
                  aria-label={claimed ? "Claim request sent" : "Claim this item"}
                  className={`group/btn relative w-full sm:w-fit px-xl py-sm rounded-full font-button text-button flex justify-center items-center gap-sm transition-all duration-200 active:scale-95 shadow-sm ${
                    claimed
                      ? "bg-black/5 text-black/40 cursor-not-allowed shadow-none"
                      : "bg-black text-white hover:shadow-lg hover:-translate-y-[1px]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                      claimed ? "" : "group-hover/btn:rotate-[-8deg]"
                    }`}
                  >
                    {claimed ? "check_circle" : "front_hand"}
                  </span>
                  <span>{claimed ? "Request Sent" : "Claim item"}</span>
                </button>

                {/* Finder details — appears after claiming */}
                {claimed && isLoggedIn && (
                  <div className="mt-xl pt-xl border-t border-outline-variant">
                    {post.handed_to_security ? (
                      <>
                        <h3 className="font-label-caps text-label-caps text-black/60 mb-sm">Item handed to security</h3>
                        <p className="font-body-lg text-black leading-relaxed">
                          This item was turned in to Campus Security. Head to the security office with your student ID to claim it.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-label-caps text-label-caps text-black/60 mb-md">Finder details for meetup</h3>
                        <div className="flex flex-col gap-sm">
                          <div className="flex justify-between items-center py-sm border-b border-outline-variant">
                            <span className="font-label-caps text-label-caps text-black/60">Name</span>
                            <span className="text-black font-headline-md">{post.reporter_name}</span>
                          </div>
                          <div className="flex justify-between items-center py-sm border-b border-outline-variant">
                            <span className="font-label-caps text-label-caps text-black/60">Messenger Link</span>
                            <span className="text-black font-headline-md">{post.messenger_link}</span>
                          </div>
                          {post.pickup_location && (
                            <div className="flex justify-between items-center py-sm">
                              <span className="font-label-caps text-label-caps text-black/60">Pickup Location</span>
                              <span className="text-black font-headline-md">{post.pickup_location}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out p-lg"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-lg right-lg text-white"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>
          <img
            src={post.image_url}
            alt={post.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
      <BottomNav />

    </div>
  )
}

export default ItemDetail