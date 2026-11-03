import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"

function MyClaims() {
  const navigate = useNavigate()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  const handleCancelClaim = async (claimId) => {
  const confirmed = window.confirm("Cancel this claim? The item will become available for others again.")
  if (!confirmed) return

  try {
    await api.delete(`/claims/${claimId}`)
    setClaims(claims.filter(claim => claim.claim_id !== claimId))
  } catch (err) {
    console.error(err)
  }
}
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get('/claims/my')
        setClaims(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchClaims()
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="flex items-center gap-sm font-body-lg text-body-lg text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading your claims...
        </p>
      </div>
    )
  }

  const pendingCount = claims.filter(claim => !claim.is_resolved).length

  return (
    <div className="bg-background text-on-surface min-h-screen overflow-x-clip">

      <Navbar />

      <div className="flex">
        <SideBar />

        <main className="flex-1 min-w-0 px-margin-mobile md:px-8 lg:pl-[120px] lg:pr-margin-desktop pt-xl lg:pt-xxl">
          <div className="max-w-[1240px] mx-auto">

            {/* Page header */}
            <div className="mb-xl flex flex-col gap-md md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1] tracking-[-0.03em] text-ink">My Claims</h1>
                <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">Track and manage your claimed items across campus.</p>
              </div>
              {claims.length > 0 && (
                <p className="flex items-center gap-sm font-body-sm text-body-sm font-semibold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-violet" />
                  {pendingCount} waiting for pickup
                </p>
              )}
            </div>

            {claims.length === 0 ? (
              <div className="mx-auto flex max-w-md flex-col items-center rounded-[28px] border-2 border-ink bg-surface-container-lowest p-xl text-center shadow-pop">
                <span className="mb-lg grid h-20 w-20 place-items-center rounded-3xl border-2 border-ink bg-violet">
                  <span className="material-symbols-outlined text-[40px] text-ink">search_check</span>
                </span>
                <h3 className="font-display text-[28px] font-bold tracking-tight text-ink">No claims yet</h3>
                <p className="mt-xs mb-lg font-body-lg text-body-lg text-on-surface-variant">Browse the feed to find something that's yours.</p>
                <button
                  type="button"
                  onClick={() => navigate("/feed")}
                  className="inline-flex h-12 items-center gap-sm rounded-full border-2 border-ink bg-lime px-lg font-button text-button shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop"
                >
                  Browse All Items
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {claims.map(claim => (
                  <article
                    key={claim.claim_id}
                    className={`group flex flex-col overflow-hidden rounded-[24px] border-2 border-ink bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-pop ${claim.is_resolved ? "opacity-80 hover:opacity-100" : ""}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-violet-soft">
                      {claim.image_url ? (
                        <img
                          src={claim.image_url}
                          alt={claim.title}
                          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${claim.is_resolved ? "grayscale" : ""}`}
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <span className="material-symbols-outlined text-[44px] text-ink/40">image</span>
                        </div>
                      )}
                      <span className={`absolute left-3 top-3 rounded-full border-2 border-ink px-3 py-0.5 font-label-caps text-label-caps uppercase ${claim.is_resolved ? "bg-surface-container-lowest" : "bg-violet"}`}>
                        {claim.is_resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-md">
                      <h3 className={`font-headline-md text-headline-md line-clamp-2 ${claim.is_resolved ? "text-on-surface-variant line-through" : "text-ink"}`}>
                        {claim.title}
                      </h3>

                      <p className="mt-sm flex items-start gap-xs font-body-sm text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined shrink-0 text-[18px]">location_on</span>
                        <span className="line-clamp-2">{`${claim.building}${claim.room ? `, ${claim.room}` : ''}`}</span>
                      </p>

                      <div className="mt-auto flex flex-col gap-sm pt-md">
                        {claim.is_resolved ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/item/${claim.post_id}`)}
                            className="h-11 w-full rounded-full border-2 border-ink font-button text-button transition-colors hover:bg-violet-soft"
                          >
                            View Details
                          </button>
                        ) : (
                          <>
                            {/* Pickup info */}
                            <div className="flex items-start gap-sm rounded-2xl bg-lime-soft px-md py-sm font-body-sm text-body-sm text-ink">
                              <span className="material-symbols-outlined shrink-0 text-[20px]">
                                {claim.handed_to_security ? "local_police" : claim.pickup_location ? "pin_drop" : "hourglass_top"}
                              </span>
                              {claim.handed_to_security ? (
                                <p>Head to Campus Security to pick this up.</p>
                              ) : claim.pickup_location ? (
                                <p><span className="font-bold">Pickup:</span> {claim.pickup_location}</p>
                              ) : (
                                <p>Awaiting finder confirmation.</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCancelClaim(claim.claim_id)}
                              className="h-11 w-full rounded-full border-2 border-error font-button text-button text-error transition-colors hover:bg-error-container"
                            >
                              Cancel Claim
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                ))}

                {/* CTA card */}
                <div className="flex flex-col items-center justify-center gap-md rounded-[24px] border-2 border-ink bg-lime p-lg text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-3xl text-ink">search_check</span>
                  </span>
                  <div>
                    <h3 className="font-display text-[24px] font-bold tracking-tight text-ink">Lost Something Else?</h3>
                    <p className="mt-xs font-body-sm text-body-sm text-ink/70">Check the global feed for recently posted items across campus.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/feed")}
                    className="h-11 rounded-full border-2 border-ink bg-ink px-lg font-button text-button text-lime transition-transform hover:-translate-y-0.5"
                  >
                    Browse All Items
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <Footer />
      <BottomNav />

    </div>
  )
}

export default MyClaims
