import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function ItemDetail() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isLoggedIn, openAuthModal } = useAuth()
  const { id } = useParams()
  const [claimed, setClaimed] = useState(false)   // true when *I* claimed it
  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [claimError, setClaimError] = useState("")
  const [claiming, setClaiming] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const DESCRIPTION_LIMIT = 220
  const isLongDescription = post.description && post.description.length > DESCRIPTION_LIMIT
  const displayedDescription =
    isLongDescription && !descExpanded
      ? post.description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "…"
      : post.description

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`)
      setPost(response.data)
      setClaimed(Boolean(response.data.claimed_by_me))
    } catch (err) {
      setError("Failed to load this item. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Refetch after logging in, so we know if this is your own post or your claim
  useEffect(() => {
    fetchPost()
  }, [id, isLoggedIn])

  const handleClaim = async () => {
    if (!isLoggedIn) {
      openAuthModal('login')
      return
    }
    setClaimError("")
    setClaiming(true)
    try {
      await api.post('/claims', { post_id: id })
      setClaimed(true)
      await fetchPost()
      toast("Claim sent! Contact the finder to arrange pickup.")
    } catch (err) {
      setClaimError(err.response?.data?.message || "Failed to claim this item. Please try again.")
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="flex items-center gap-sm font-body-lg text-body-lg text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading item...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-margin-mobile">
        <div className="flex max-w-md flex-col items-center rounded-[28px] border-2 border-ink bg-surface-container-lowest p-xl text-center shadow-pop">
          <span className="mb-md grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-error-container">
            <span className="material-symbols-outlined text-[32px] text-error">error</span>
          </span>
          <p className="font-body-lg text-body-lg text-ink">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/feed")}
            className="mt-lg h-11 rounded-full border-2 border-ink bg-lime px-lg font-button text-button shadow-pop-sm"
          >
            Back to feed
          </button>
        </div>
      </div>
    )
  }

  const isOwnPost = Boolean(post.is_own_post)
  const takenByOther = post.is_claimed && !claimed && !isOwnPost

  const status = post.is_resolved
    ? { label: "Resolved", dot: "bg-surface-container-highest" }
    : isOwnPost
      ? post.is_claimed
        ? { label: "Claimed, waiting for handoff", dot: "bg-violet" }
        : { label: "Awaiting Claim", dot: "bg-lime animate-pulse" }
      : claimed
        ? { label: "Pending Confirmation", dot: "bg-violet" }
        : takenByOther
          ? { label: "Already claimed", dot: "bg-surface-container-highest" }
          : { label: "Awaiting Claim", dot: "bg-lime animate-pulse" }

  const claimDisabled = claimed || takenByOther || post.is_resolved || claiming

  // Copy the finder's contact (phone number or link) to the clipboard
  const handleCopyContact = async () => {
    const text = post.messenger_link
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for browsers that block the clipboard API
      const temp = document.createElement("textarea")
      temp.value = text
      document.body.appendChild(temp)
      temp.select()
      document.execCommand("copy")
      document.body.removeChild(temp)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-on-surface">

      <Navbar />

      <div className="flex flex-1">
        <SideBar/>

        <main className="flex-1 min-w-0 px-margin-mobile md:px-8 lg:px-12 pt-lg lg:pt-xl">
          <div className="max-w-[1440px]">

            {/* Back button */}
            <button
              type="button"
              onClick={() => navigate("/feed")}
              className="group mb-lg inline-flex h-10 items-center gap-xs rounded-full border-2 border-ink bg-surface-container-lowest pl-2 pr-md font-button text-button transition-colors hover:bg-lime"
            >
              <span className="material-symbols-outlined text-[22px] transition-transform group-hover:-translate-x-0.5">chevron_left</span>
              Back to feed
            </button>

            {/* Main split: image left, details right */}
            <div className="grid grid-cols-1 gap-xl lg:grid-cols-[1.1fr_1fr] lg:gap-xxl">

              {/* Left: image */}
              <div className="lg:sticky lg:top-[122px] lg:self-start">
                {post.image_url ? (
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label="View full size photo"
                    className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[28px] border-2 border-ink bg-violet-soft shadow-pop lg:aspect-square"
                  >
                    <img
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      src={post.image_url}
                    />
                    <span className="absolute bottom-md right-md inline-flex items-center gap-xs rounded-full border-2 border-ink bg-surface-container-lowest px-md py-1.5 font-button text-button shadow-pop-sm transition-transform group-hover:-translate-y-0.5">
                      <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                      View full size
                    </span>
                  </button>
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center rounded-[28px] border-2 border-ink bg-violet-soft lg:aspect-square">
                    <span className="material-symbols-outlined text-[64px] text-ink/40">image</span>
                  </div>
                )}
              </div>

              {/* Right: details */}
              <div className="flex flex-col">

                <div className="flex flex-wrap gap-sm">
                  {post.category && (
                    <span className="rounded-full border-2 border-ink bg-violet px-3 py-0.5 font-label-caps text-label-caps uppercase">{post.category}</span>
                  )}
                  <span className="rounded-full border-2 border-ink bg-lime px-3 py-0.5 font-label-caps text-label-caps uppercase">Found</span>
                </div>

                <h1 className="mt-md font-display text-[clamp(34px,4.6vw,58px)] font-bold leading-[1] tracking-[-0.03em] text-ink">
                  {post.title}
                </h1>

                <p className="mt-sm flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Found on {formatDate(post.created_at)}
                </p>

                {post.description && (
                  <div className="mt-lg">
                    <h3 className="mb-sm font-label-caps text-label-caps uppercase text-on-surface-variant">Description</h3>
                    <p className="whitespace-pre-line font-body-lg text-body-lg font-normal leading-relaxed text-ink">
                      {displayedDescription}
                    </p>
                    {isLongDescription && (
                      <button
                        type="button"
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-sm font-button text-button text-ink underline underline-offset-4 hover:text-on-surface-variant"
                      >
                        {descExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}

                {/* Location + reporter */}
                <div className="mt-xl grid grid-cols-1 gap-sm sm:grid-cols-2">
                  <div className="flex items-start gap-md rounded-[20px] border-2 border-ink bg-surface-container-lowest p-md">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-lime">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">Found at</p>
                      <p className="mt-0.5 font-body-lg text-body-lg font-semibold text-ink">{post.building}</p>
                      {post.room && <p className="font-body-sm text-body-sm text-on-surface-variant">{post.room}</p>}
                    </div>
                  </div>

                  <div className="flex items-start gap-md rounded-[20px] border-2 border-ink bg-surface-container-lowest p-md">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-violet">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </span>
                    <div className="min-w-0">
                      <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">Reported by</p>
                      <p className="mt-0.5 font-body-lg text-body-lg font-semibold text-ink">{post.reporter_name}</p>
                      <p className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Verified Student Finder
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status + claim */}
                <div className="mt-xl rounded-[24px] border-2 border-ink bg-surface-container-lowest p-lg">
                  <div className="flex items-center gap-md">
                    <span className={`h-3.5 w-3.5 rounded-full border-2 border-ink ${status.dot}`} />
                    <span className="font-headline-md text-headline-md text-ink">{status.label}</span>
                  </div>

                  {isOwnPost ? (
                    /* Your own post: no claim button */
                    <div className="mt-lg rounded-2xl border-2 border-ink bg-lime-soft p-md">
                      <p className="flex items-start gap-sm font-body-lg text-body-lg text-ink">
                        <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin</span>
                        This is your post. You can't claim items you reported.
                      </p>
                      <div className="mt-md flex flex-wrap gap-sm">
                        {!post.is_resolved && (
                          <button
                            type="button"
                            onClick={() => navigate(`/report/${post.id}`)}
                            className="h-11 rounded-full border-2 border-ink bg-surface-container-lowest px-lg font-button text-button transition-colors hover:bg-lime"
                          >
                            Edit post
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => navigate("/my-posts")}
                          className="h-11 rounded-full border-2 border-ink px-lg font-button text-button transition-colors hover:bg-surface-container-lowest"
                        >
                          Go to My Posts
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleClaim}
                        disabled={claimDisabled}
                        aria-label={claimed ? "Claim request sent" : "Claim this item"}
                        className={`group/btn mt-lg flex h-14 w-full items-center justify-center gap-sm rounded-full border-2 font-button text-body-lg font-bold transition-all ${
                          claimDisabled
                            ? "cursor-not-allowed border-ink/20 bg-surface-container text-on-surface-variant"
                            : "border-ink bg-lime text-ink shadow-pop hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0 active:shadow-none"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${claimDisabled ? "" : "group-hover/btn:-rotate-12"}`}
                        >
                          {claimed ? "check_circle" : takenByOther ? "block" : "front_hand"}
                        </span>
                        <span>
                          {claiming ? "Claiming..." : claimed ? "Request Sent" : takenByOther ? "Already claimed" : "Claim item"}
                        </span>
                      </button>

                      {claimError && (
                        <p role="alert" className="mt-sm flex items-start gap-sm rounded-2xl border-2 border-error bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
                          <span className="material-symbols-outlined text-[20px]">error</span>
                          {claimError}
                        </p>
                      )}
                      {!isLoggedIn && !claimed && (
                        <p className="mt-sm text-center font-body-sm text-body-sm text-on-surface-variant">You'll need to log in first.</p>
                      )}
                    </>
                  )}
                </div>

                {/* Finder details: appears after claiming */}
                {claimed && isLoggedIn && !isOwnPost && (
                  <div className="mt-lg rounded-[24px] border-2 border-ink bg-violet-soft p-lg">
                    {post.handed_to_security ? (
                      <div className="flex items-start gap-md">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface-container-lowest">
                          <span className="material-symbols-outlined text-[20px]">local_police</span>
                        </span>
                        <div>
                          <h3 className="font-label-caps text-label-caps uppercase text-ink">Item handed to security</h3>
                          <p className="mt-xs font-body-lg text-body-lg font-normal leading-relaxed text-ink">
                            This item was turned in to Campus Security. Head to the security office with your student ID to claim it.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="mb-md font-label-caps text-label-caps uppercase text-ink">Finder details for meetup</h3>
                        <dl className="flex flex-col divide-y-2 divide-ink/10">
                          <div className="flex flex-wrap items-center justify-between gap-sm py-sm">
                            <dt className="font-label-caps text-label-caps uppercase text-on-surface-variant">Name</dt>
                            <dd className="font-body-lg text-body-lg font-semibold text-ink">{post.reporter_name}</dd>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-sm py-sm">
                            <dt className="font-label-caps text-label-caps uppercase text-on-surface-variant">Contact</dt>
                            <dd className="flex min-w-0 max-w-full items-center gap-sm">
                              {post.messenger_link ? (
                                <>
                                  <span className="min-w-0 truncate font-body-lg text-body-lg font-semibold text-ink">{post.messenger_link}</span>
                                  <button
                                    type="button"
                                    onClick={handleCopyContact}
                                    aria-label="Copy contact"
                                    className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-full border-2 border-ink px-3 font-button text-[13px] font-semibold transition-colors ${
                                      copied ? "bg-lime" : "bg-surface-container-lowest hover:bg-lime-soft"
                                    }`}
                                  >
                                    <span className="material-symbols-outlined text-[16px]">{copied ? "check" : "content_copy"}</span>
                                    {copied ? "Copied" : "Copy"}
                                  </button>
                                </>
                              ) : (
                                <span className="font-body-lg text-body-lg font-semibold text-ink">Not set</span>
                              )}
                            </dd>
                          </div>
                          {post.pickup_location && (
                            <div className="flex flex-wrap items-center justify-between gap-sm py-sm">
                              <dt className="font-label-caps text-label-caps uppercase text-on-surface-variant">Pickup Location</dt>
                              <dd className="font-body-lg text-body-lg font-semibold text-ink">{post.pickup_location}</dd>
                            </div>
                          )}
                        </dl>
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
          className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-ink/90 p-lg backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-lg top-lg grid h-11 w-11 place-items-center rounded-full border-2 border-background text-background transition-colors hover:bg-background hover:text-ink"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <img
            src={post.image_url}
            alt={post.title}
            className="max-h-full max-w-full rounded-2xl object-contain"
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