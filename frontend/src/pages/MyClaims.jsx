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

  if (loading) return <p>Loading...</p>

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <Navbar />

      <div className="flex">
        <SideBar />

        <main className="flex-1 pl-[150px] pr-[120px] py-[120px] min-h-[calc(100vh-64px)] bg-background transition-all duration-300">
          <div>

            {/* Page header */}
            <div className="flex items-end justify-between mb-xl">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-black mb-xs">My Claims</h2>
                <p className="font-body-lg text-black/60">Track and manage your claimed items across campus.</p>
              </div>
            </div>

            {claims.length === 0 ? (
              <div className="bg-surface-container-lowest p-xl max-w-md mx-auto flex flex-col items-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]">
                <span className="material-symbols-outlined text-black text-5xl mb-lg">search_check</span>
                <h3 className="font-headline-md text-headline-md text-black mb-sm">No claims yet</h3>
                <p className="font-body-lg text-black/60 mb-lg">Browse the feed to find something that's yours.</p>
                <button
                  onClick={() => navigate("/feed")}
                  className="px-xl py-md bg-black text-white rounded-full font-button text-button hover:opacity-90 active:scale-95 transition-all"
                >
                  Browse All Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-xxl">
                {claims.map(claim => (
                  <div
                    key={claim.claim_id}
                    className={`bg-background cute-card-shadow transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] duration-300 ${claim.is_resolved ? "opacity-80" : ""}`}
                  >
                    <div className="w-full h-80 overflow-hidden mb-md relative">
                      <img
                        src={claim.image_url}
                        alt={claim.title}
                        className={`w-full h-full object-cover ${claim.is_resolved ? "grayscale" : ""}`}
                      />
                      <div className={`absolute top-sm right-sm px-md py-xs rounded-full font-label-caps text-label-caps ${claim.is_resolved ? "bg-surface-container-highest text-black/60" : "bg-secondary-container text-on-secondary-container"}`}>
                        {claim.is_resolved ? "RESOLVED" : "PENDING"}
                      </div>
                    </div>

                    <h3 className={`font-headline-md uppercase text-headline-md mb-xs ${claim.is_resolved ? "text-black/40 line-through" : "text-black"}`}>
                      {claim.title}
                    </h3>

                    <div className="flex items-center gap-sm text-black/60 mb-md">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="font-body-lg">
                        {`${claim.building}${claim.room ? `, ${claim.room}` : ''}`}
                      </span>
                    </div>

                    <div className="mt-auto pt-md border-t border-surface-container-highest flex flex-col gap-sm">
                    {claim.is_resolved ? (
                      <button
                        onClick={() => navigate(`/item/${claim.post_id}`)}
                        className="w-full py-sm bg-surface-variant text-black rounded-full font-label-caps text-label-caps uppercase hover:bg-background transition-all"
                      >
                        View Details
                      </button>
                    ) : (
                      <>
                        {claim.handed_to_security ? (
                          <p className="font-body-lg text-black/60 italic">Head to Campus Security to pick this up.</p>
                        ) : claim.pickup_location ? (
                          <p className="font-body-lg text-black/60 italic">Pickup: {claim.pickup_location}</p>
                        ) : (
                          <p className="font-body-lg text-black/60 italic">Awaiting finder confirmation.</p>
                        )}
                        <button
                          onClick={() => handleCancelClaim(claim.claim_id)}
                          className="w-full py-sm bg-error-container text-error border border-red-500 font-label-caps text-label-caps uppercase hover:opacity-90 transition-all"
                        >
                          Cancel Claim
                        </button>
                      </>
                    )}
                  </div>
                  </div>
                ))}

                {/* CTA card */}
                <div className="bg-primary-container p-lg flex flex-col items-center justify-center text-center gap-md">
                  <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-black text-3xl">search_check</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-black">Lost Something Else?</h3>
                    <p className="font-body-lg text-black/60 mb-lg">Check the global feed for recently posted items across campus.</p>
                  </div>
                  <button
                    onClick={() => navigate("/feed")}
                    className="px-xl py-md bg-black text-white rounded-full font-button text-button hover:opacity-90 active:scale-95 transition-all"
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