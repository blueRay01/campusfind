import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"

function MyClaims() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
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
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className={`flex-1 p-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <div className="max-w-[1100px] mx-auto">

            {/* Page header */}
            <div className="flex items-end justify-between mb-xl">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">My Claims</h2>
                <p className="font-body-lg text-secondary">Track and manage your claimed items across campus.</p>
              </div>
            </div>

            {claims.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-surface-container-highest p-xxl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-lg">search_check</span>
                <h3 className="font-headline-md text-headline-md text-primary mb-sm">No claims yet</h3>
                <p className="font-body-sm text-secondary mb-lg">Browse the feed to find something that's yours.</p>
                <button
                  onClick={() => navigate("/feed")}
                  className="px-xl py-md bg-primary text-on-primary rounded-full font-button text-button hover:opacity-90 active:scale-95 transition-all"
                >
                  Browse All Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {claims.map(claim => (
                  <div
                    key={claim.claim_id}
                    className={`bg-surface-container-lowest border border-surface-container-highest rounded-xl p-lg flex flex-col hover:bg-white transition-all ${claim.is_resolved ? "opacity-80" : ""}`}
                  >
                    <div className="w-full h-40 rounded-lg overflow-hidden mb-md relative">
                      <img
                        src={claim.image_url}
                        alt={claim.title}
                        className={`w-full h-full object-cover ${claim.is_resolved ? "grayscale" : ""}`}
                      />
                      <div className={`absolute top-sm right-sm px-md py-xs rounded-full font-label-caps text-[10px] ${claim.is_resolved ? "bg-surface-container-highest text-secondary" : "bg-secondary-container text-on-secondary-container"}`}>
                        {claim.is_resolved ? "RESOLVED" : "PENDING"}
                      </div>
                    </div>

                    <h3 className={`font-button text-button mb-xs ${claim.is_resolved ? "text-on-surface-variant line-through" : "text-primary"}`}>
                      {claim.title}
                    </h3>

                    <div className="flex items-center gap-sm text-secondary mb-md">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="font-body-sm text-body-sm">
                        {`${claim.building}${claim.room ? `, ${claim.room}` : ''}`}
                      </span>
                    </div>

                    <div className="mt-auto pt-md border-t border-surface-container-highest flex flex-col gap-sm">
                    {claim.is_resolved ? (
                      <button
                        onClick={() => navigate(`/item/${claim.post_id}`)}
                        className="w-full py-sm bg-surface-variant text-on-surface-variant rounded-full font-label-caps text-[10px] uppercase hover:bg-surface-container-highest transition-all"
                      >
                        View Details
                      </button>
                    ) : (
                      <>
                        {claim.handed_to_security ? (
                          <p className="font-body-sm text-secondary italic">Head to Campus Security to pick this up.</p>
                        ) : claim.pickup_location ? (
                          <p className="font-body-sm text-secondary italic">Pickup: {claim.pickup_location}</p>
                        ) : (
                          <p className="font-body-sm text-secondary italic">Awaiting finder confirmation.</p>
                        )}
                        <button
                          onClick={() => handleCancelClaim(claim.claim_id)}
                          className="w-full py-sm bg-error-container text-error rounded-full font-label-caps text-[10px] uppercase hover:opacity-90 transition-all"
                        >
                          Cancel Claim
                        </button>
                      </>
                    )}
                  </div>
                  </div>
                ))}

                {/* CTA card */}
                <div className="bg-primary-container rounded-xl p-lg flex flex-col items-center justify-center text-center gap-md border border-primary-fixed-dim shadow-lg">
                  <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">search_check</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-primary-fixed">Lost Something Else?</h3>
                    <p className="font-body-sm text-on-primary-container mb-lg">Check the global feed for recently posted items across campus.</p>
                  </div>
                  <button
                    onClick={() => navigate("/feed")}
                    className="px-xl py-md bg-primary-fixed text-on-primary-fixed rounded-full font-button text-button hover:opacity-90 active:scale-95 transition-all"
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