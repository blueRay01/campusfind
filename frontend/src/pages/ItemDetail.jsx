import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
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
  const{ isLoggedIn, openAuthModal } = useAuth();
  const {id} = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const claim = await api.post('/claims', { post_id : id } )
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

      <Navbar />

      <div className="flex">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className={`flex-1 p-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <div className="max-w-[1200px] mx-auto">

            {/* Back button */}
            <nav className="mb-lg">
              <button
                onClick={() => navigate("/feed")}
                className="flex items-center text-on-surface-variant hover:text-primary transition-colors group"
              >
                <span className="material-symbols-outlined mr-xs group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-button text-button">Back to Feed</span>
              </button>
            </nav>

            <div className="grid grid-cols-12 gap-lg">

              {/* Left column */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">

                {/* Main item card */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col">
                  <div className="relative h-[480px] w-full bg-secondary-container">
                    <img
                      alt={post.title}
                      className="h-full w-full object-cover"
                      src={post.image_url}
                    />
                    <div className="absolute top-lg right-lg">
                      <span className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-caps text-label-caps uppercase tracking-wider">FOUND</span>
                    </div>
                  </div>

                  <div className="p-xl">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs ">{post.title}</h2>
                        <p className="text-on-surface-variant font-body-lg">Found on {formatDate(post.created_at)}</p>
                      </div>
                      <div className="flex gap-sm flex-wrap justify-end">
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed px-md py-xs rounded-full font-label-caps text-label-caps">{post.category}</span>
                      </div>
                    </div>

                    {post.description && (
                      <div className="space-y-md">
                        <h3 className="font-headline-md text-headline-md text-primary">Description</h3>
                        <p className="text-on-surface-variant font-body-lg leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details bento row */}
                <div className="grid grid-cols-2 gap-lg">
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col justify-center">
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md">FOUND AT</h3>
                    <div className="flex items-start gap-md">
                      <div className="bg-primary-fixed p-sm rounded-lg">
                        <span className="material-symbols-outlined text-on-primary-fixed">location_on</span>
                      </div>
                      <div>
                        <p className="font-headline-md text-headline-md text-primary">{post.building}</p>
                        <p className="text-on-surface-variant font-body-sm">{post.room}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col justify-center">
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md">REPORTED BY</h3>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary">person</span>
                      </div>
                      <div>
                        <p className="font-headline-md text-headline-md text-primary">{post.reporter_name}</p>
                        <p className="text-on-surface-variant font-body-sm">Verified Student Finder</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right column */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">

                {/* Status card */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl flex flex-col">
                  <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-lg uppercase tracking-widest">Current Status</h3>
                  <div className="flex items-center gap-md mb-xl">
                    <div className={`h-4 w-4 rounded-full ${post.is_resolved ? "bg-secondary" : "bg-primary animate-pulse"}`}></div>
                    <span className="font-headline-md text-headline-md text-primary">
                      {post.is_resolved ? "Resolved" : claimed ? "Pending Confirmation" : "Awaiting Claim"}
                    </span>
                  </div>

                  <div className="space-y-md mb-xl">
                    <div className="flex items-center gap-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                      <span className="font-body-sm">Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">schedule</span>
                      <span className="font-body-sm">
                        {post.is_resolved ? "Handoff Confirmed" : claimed ? "Awaiting Finder Confirmation" : "Awaiting Claim"}
                      </span>
                    </div>
                  </div>

                  {/* Claim button — changes when clicked */}
                  <button
                    onClick={handleClaim}
                    disabled={claimed}
                    className={`w-full py-lg rounded-full font-button text-button flex justify-center items-center gap-md transition-all active:scale-95 ${claimed ? "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed" : "bg-primary text-on-primary hover:bg-primary-container"}`}
                  >
                    {claimed ? "Request Sent" : "This is mine"}
                    <span className="material-symbols-outlined">front_hand</span>
                  </button>
                </div>

                {/* Finder info — only shows after claiming */}
                {claimed && isLoggedIn && (
                  <div className="bg-primary-fixed rounded-xl p-xl border-none">
                    {post.handed_to_security ? (
                      <>
                        <h3 className="font-label-caps text-label-caps text-on-primary-fixed mb-md">ITEM HANDED TO SECURITY</h3>
                        <p className="font-body-sm text-on-primary-fixed leading-relaxed">
                          This item was turned in to Campus Security. Head to the security office with your student ID to claim it.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-label-caps text-label-caps text-on-primary-fixed mb-md">FINDER DETAILS FOR MEETUP</h3>
                        <div className="space-y-md">
                          <div className="flex justify-between items-center py-sm border-b border-on-primary-fixed/10">
                            <span className="text-on-primary-fixed-variant font-body-sm">Name</span>
                            <span className="text-on-primary-fixed font-headline-md">{post.reporter_name}</span>
                          </div>
                          <div className="flex justify-between items-center py-sm border-b border-on-primary-fixed/10">
                            <span className="text-on-primary-fixed-variant font-body-sm">Messenger Link</span>
                            <span className="text-on-primary-fixed font-headline-md">{post.messenger_link}</span>
                          </div>
                          {post.pickup_location && (
                            <div className="flex justify-between items-center py-sm">
                              <span className="text-on-primary-fixed-variant font-body-sm">Pickup Location</span>
                              <span className="text-on-primary-fixed font-headline-md">{post.pickup_location}</span>
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

      <Footer />
      <BottomNav />

    </div>
  )
}

export default ItemDetail