import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"

function MyPosts() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Active")
  const [posts, setPosts] = useState([]);

  const handleResolve = async (postId) => {
    try {
      await api.patch(`/posts/${postId}/resolve`)
      setPosts(posts.map(post => 
        post.id === postId ? {...post, is_resolved: true} : post
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (postId) => {
  const confirmed = window.confirm("Are you sure you want to delete this post? This cannot be undone.")
  if (!confirmed) return

  try {
    await api.delete(`/posts/${postId}`)
    setPosts(posts.filter(post => post.id !== postId))
  } catch (err) {
    console.error(err)
  }
}

  useEffect(() => {
      const fetchPost = async () => {
        const response = await api.get('/posts/my')
        setPosts(response.data)
      }
      fetchPost()
  }, [])


  const filteredPosts = posts.filter(post =>
    activeTab === "Active" ? post.is_resolved === false : post.is_resolved === true
  )

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <Navbar />

      <div className="flex">
        <SideBar />

        <main className="flex-1 pl-[150px] pr-[120px] py-[120px] min-h-[calc(100vh-64px)] bg-background transition-all duration-300">
          <div>

            {/* Page header */}
            <div className="flex justify-between items-end mb-xl">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-black">My Reported Items</h2>
                <p className="text-black/60 font-body-lg mt-xs">Manage the items you've found or lost on campus.</p>
              </div>

              {/* Tab toggle */}
              <div className="flex bg-surface-container-low rounded-full p-xs">
                <button
                  onClick={() => setActiveTab("Active")}
                  className={`px-md py-sm rounded-full font-button text-button transition-colors ${activeTab === "Active" ? "bg-white shadow-sm text-black" : "text-black/60 hover:text-black"}`}
                >
                  Active ({posts.filter(p => p.is_resolved === false).length})
                </button>
                <button
                  onClick={() => setActiveTab("Resolved")}
                  className={`px-md py-sm rounded-full font-button text-button transition-colors ${activeTab === "Resolved" ? "bg-white shadow-sm text-black" : "text-black/60 hover:text-black"}`}
                >
                  Resolved ({posts.filter(p => p.is_resolved === true).length})
                </button>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-xxl">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className={`bg-background cute-card-shadow overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] duration-300 group ${post.is_resolved === true ? "opacity-80 hover:opacity-100" : ""}`}
                >
                  {/* Image */}
                  <div className={`relative h-80 overflow-hidden ${post.is_resolved === true ? "grayscale group-hover:grayscale-0 transition-all duration-500" : ""}`}>
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-md left-md">
                      <span className={`px-md py-1 font-label-caps text-label-caps rounded-full ${post.is_resolved === false ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container"}`}>
                        {post.is_resolved ? "Resolved" : "Active"}
                      </span>
                    </div>
                    {post.is_resolved === true && (
                      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-lg">
                    <div className="flex justify-between items-start mb-sm">
                      <h3 className="font-headline-md text-headline-md text-black">{post.title}</h3>
                      <span className="text-black/60">
                        <span className="material-symbols-outlined text-[18px]">
                          {post.is_resolved === true ? "check_circle" : "more_vert"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-xs mb-lg">
                      <div className="flex items-center gap-xs text-black/60 font-body-lg">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {`${post.building}${post.room ? `, ${post.room}`:''}`}
                      </div>
                      <div className="flex items-center gap-xs text-black/60 font-body-lg">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {post.created_at}
                      </div>
                    </div>

                    {/* Actions */}
                    {post.is_resolved === false ? (
                      <div className="pt-md border-t border-surface-container-low flex flex-col gap-sm">
                        {post.is_claimed && (
                          <button
                            onClick={() => handleResolve(post.id)}
                            className="w-full py-sm bg-black text-white font-button text-button hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">task_alt</span>
                            Confirm Handoff
                          </button>
                        )}
                        <div className="grid grid-cols-3 gap-sm">
                          <button
                            onClick={() => navigate(`/report/${post.id}`)}
                            className="flex flex-col items-center gap-1 py-sm hover:bg-surface-container-low transition-colors group/btn"
                          >
                            <span className="material-symbols-outlined text-black/60 group-hover/btn:text-black">edit</span>
                            <span className="font-label-caps text-label-caps text-black/60 group-hover/btn:text-black">EDIT</span>
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="flex flex-col items-center gap-1 py-sm hover:bg-error-container transition-colors group/btn">
                            <span className="material-symbols-outlined text-black/60 group-hover/btn:text-error">delete</span>
                            <span className="font-label-caps text-label-caps text-black/60 group-hover/btn:text-error">DELETE</span>
                          </button>
                          <button
                            onClick={() => navigate(`/item/${post.id}`)}
                            className="flex flex-col items-center gap-1 py-sm hover:bg-primary-fixed transition-colors group/btn"
                          >
                            <span className="material-symbols-outlined text-black/60 group-hover/btn:text-black">visibility</span>
                            <span className="font-label-caps text-label-caps text-black/60 group-hover/btn:text-black">DETAILS</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-md border-t border-surface-container-low flex justify-center">
                        <span className="font-label-caps text-label-caps text-black/60">Item Claimed & Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* CTA card */}
              <div
                onClick={() => navigate("/report")}
                className="lg:col-span-4 mt-xl p-xxl bg-background border border-dashed border-black/20 flex flex-col items-center justify-center text-center group hover:border-black transition-all cursor-pointer"
              >
                <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-black text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-black mb-sm">Found something else?</h3>
                <p className="text-black/60 font-body-lg max-w-md mb-xl">Help your fellow students by reporting items you find around campus. It only takes a minute to make someone's day.</p>
                <button className="px-xl py-lg bg-black text-white font-button text-button rounded-full hover:opacity-90 active:scale-95 transition-all">
                  Report a New Item
                </button>
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

export default MyPosts