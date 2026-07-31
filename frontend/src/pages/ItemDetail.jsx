import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

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

      <NavBar />

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
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcREwoW-OVzxln2QspWodfOr6xxw8n7j9Z6Gpy4jWwQKRuvW9_NKg2m9tM852UgbLP5G9TZyKU_FnbGO_HtkpVKGxjoilNvTBAj06fHuzpKC2NoM9rfMhEX3nLhIvd_FeP9jjA12eFcQphjllxZgQSQmXxZMPjuq_5AWHIYOVMpZuTJp5anDU4UgWhCwE0KlQ2iLNIsAtpJ7nhyLghD6n8kgftn5QcsNpOjlRoRgDq76kub8ziZ5MSNOqM8oyDF1Rv7RrwRN8EjTc"
                    />
                    <div className="absolute top-lg right-lg">
                      <span className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-caps text-label-caps uppercase tracking-wider">FOUND</span>
                    </div>
                  </div>

                  <div className="p-xl">
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs ">{post.title}</h2>
                        <p className="text-on-surface-variant font-body-lg">Found yesterday at {post.created_at}</p>
                      </div>
                      <div className="flex gap-sm flex-wrap justify-end">
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed px-md py-xs rounded-full font-label-caps text-label-caps">{post.category}</span>
                      </div>
                    </div>

                    <div className="space-y-md">
                      <h3 className="font-headline-md text-headline-md text-primary">Description</h3>
                      <p className="text-on-surface-variant font-body-lg leading-relaxed">
                        Standard size Ocean Blue HydroFlask with a black flex cap. There is a small 'U of C' sticker near the bottom and a minor dent on the base. It was found on a study table in the quiet zone of the Engineering Hall library.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details bento row */}
                <div className="grid grid-cols-2 gap-lg">
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col justify-center">
                    <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md">PICKUP LOCATION</h3>
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
                    <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-headline-md text-headline-md text-primary">With Finder</span>
                  </div>

                  <div className="space-y-md mb-xl">
                    <div className="flex items-center gap-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                      <span className="font-body-sm">Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">schedule</span>
                      <span className="font-body-sm">Awaiting Claim</span>
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
                    </div>
                    <div className="mt-lg p-md bg-white/20 rounded-lg">
                      <p className="font-body-sm text-on-primary-fixed italic">"I'll be at the library service desk until 4 PM today. Just show me your student ID!"</p>
                    </div>
                  </div>
                )}

                {/* Map card */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden h-[300px] relative group">
                  <img
                    alt="Map location"
                    className="w-full h-full object-cover opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdxQx-cJj_Wk9cPIahQPAVhxqQFFWisE8mTsnk8Bvt_xQDfRds6wmpLvuUo6BPj0VolWINU7zeB0qlQtWRHUzRz-u63HnaNZuA4omKCFahcJigDoDbi1jdbnhOTYQDW7m0B8Zbj_-8mNVgn4UY-rBTjIhTtGyPwq_mwRHpa1EZVbGQxV-N8b7DCKfv32oRq6SgS_mIO-KEW-hGVTGkeunTyGqJn8XWKMqDglB7u1Dgad0MFjYbRfs-LV1zg5ZGo-2tb5uWNPWO-fY"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-on-primary p-md rounded-full shadow-lg">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                  </div>
                  <div className="absolute bottom-md left-md right-md bg-white/90 backdrop-blur-sm p-md rounded-lg border border-outline-variant flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-label-caps text-label-caps text-primary">Open in Campus Map</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </div>
                </div>

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