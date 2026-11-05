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

  const activeCount = posts.filter(p => p.is_resolved === false).length
  const resolvedCount = posts.filter(p => p.is_resolved === true).length

  // Display only: "Nov 2, 2026" instead of the raw timestamp
  const formatDate = (value) => {
    const date = new Date(value)
    return isNaN(date) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }

  const tabs = [
    { key: "Active", count: activeCount },
    { key: "Resolved", count: resolvedCount },
  ]

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-on-surface">

      <Navbar />

      <div className="flex flex-1">
        <SideBar />

        <main className="flex-1 min-w-0 px-margin-mobile md:px-8 lg:px-12 pt-xl lg:pt-xxl">
          <div className="mx-auto w-full">

            {/* Page header */}
            <div className="mb-xl flex flex-col gap-lg md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1] tracking-[-0.03em] text-ink">
                  My Reported Items
                </h1>
                <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
                  Manage the items you've found on campus.
                </p>
              </div>

              {/* Tab toggle */}
              <div role="tablist" className="flex w-full rounded-full border-2 border-ink bg-surface-container-lowest p-1 sm:w-auto">
                {tabs.map(tab => {
                  const active = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex flex-1 items-center justify-center gap-sm rounded-full px-lg py-2 font-button text-button transition-colors sm:flex-none ${
                        active ? "bg-lime text-ink" : "text-on-surface-variant hover:text-ink"
                      }`}
                    >
                      {tab.key}
                      <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[12px] font-bold ${active ? "bg-ink text-lime" : "bg-surface-container"}`}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredPosts.map(post => {
                const resolved = post.is_resolved === true
                return (
                  <article
                    key={post.id}
                    className={`group flex flex-col overflow-hidden rounded-[24px] border-2 border-ink bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-pop ${
                      resolved ? "opacity-80 hover:opacity-100" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-violet-soft ${resolved ? "grayscale transition-all duration-500 group-hover:grayscale-0" : ""}`}>
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <span className="material-symbols-outlined text-[44px] text-ink/40">image</span>
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex flex-wrap gap-xs">
                        <span className={`rounded-full border-2 border-ink px-3 py-0.5 font-label-caps text-label-caps uppercase ${resolved ? "bg-surface-container-lowest" : "bg-lime"}`}>
                          {resolved ? "Resolved" : "Active"}
                        </span>
                        {!resolved && post.is_claimed && (
                          <span className="rounded-full border-2 border-ink bg-violet px-3 py-0.5 font-label-caps text-label-caps uppercase">
                            Claimed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-md">
                      <div className="flex items-start justify-between gap-sm">
                        <h3 className="font-headline-md text-headline-md text-ink line-clamp-2">{post.title}</h3>
                        {resolved && (
                          <span className="material-symbols-outlined shrink-0 text-[22px] text-ink" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        )}
                      </div>

                      <div className="mt-sm flex flex-col gap-xs font-body-sm text-body-sm text-on-surface-variant">
                        <p className="flex items-start gap-xs">
                          <span className="material-symbols-outlined shrink-0 text-[18px]">location_on</span>
                          <span className="line-clamp-2">{`${post.building}${post.room ? `, ${post.room}`:''}`}</span>
                        </p>
                        <p className="flex items-center gap-xs">
                          <span className="material-symbols-outlined shrink-0 text-[18px]">calendar_today</span>
                          {formatDate(post.created_at)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto pt-md">
                        {!resolved ? (
                          <div className="flex flex-col gap-sm border-t-2 border-ink/10 pt-md">
                            {post.is_claimed && (
                              <button
                                type="button"
                                onClick={() => handleResolve(post.id)}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-ink font-button text-button text-lime transition-transform hover:-translate-y-0.5"
                              >
                                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                                Confirm Handoff
                              </button>
                            )}
                            <div className="grid grid-cols-3 gap-xs">
                              <button
                                type="button"
                                onClick={() => navigate(`/report/${post.id}`)}
                                className="flex flex-col items-center gap-0.5 rounded-2xl py-sm text-on-surface-variant transition-colors hover:bg-lime-soft hover:text-ink"
                              >
                                <span className="material-symbols-outlined text-[22px]">edit</span>
                                <span className="text-[11px] font-bold uppercase tracking-wide">Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(post.id)}
                                className="flex flex-col items-center gap-0.5 rounded-2xl py-sm text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
                              >
                                <span className="material-symbols-outlined text-[22px]">delete</span>
                                <span className="text-[11px] font-bold uppercase tracking-wide">Delete</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate(`/item/${post.id}`)}
                                className="flex flex-col items-center gap-0.5 rounded-2xl py-sm text-on-surface-variant transition-colors hover:bg-violet-soft hover:text-ink"
                              >
                                <span className="material-symbols-outlined text-[22px]">visibility</span>
                                <span className="text-[11px] font-bold uppercase tracking-wide">Details</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="flex items-center justify-center gap-xs border-t-2 border-ink/10 pt-md font-label-caps text-label-caps uppercase text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            Item Claimed & Verified
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}

              {/* CTA card */}
              <button
                type="button"
                onClick={() => navigate("/report")}
                className={`group col-span-full flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-ink/30 bg-surface-container-lowest/50 px-lg py-xxl text-center transition-all hover:border-ink hover:bg-surface-container-lowest ${filteredPosts.length ? "mt-lg" : ""}`}
              >
                <span className="mb-lg grid h-20 w-20 place-items-center rounded-3xl border-2 border-ink bg-lime transition-transform group-hover:-rotate-6 group-hover:scale-110">
                  <span className="material-symbols-outlined text-[40px] text-ink">add</span>
                </span>
                <span className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-tight text-ink">Found something else?</span>
                <span className="mt-sm max-w-md font-body-lg text-body-lg text-on-surface-variant">
                  Help your fellow students by reporting items you find around campus. It only takes a minute to make someone's day.
                </span>
                <span className="mt-xl inline-flex h-12 items-center gap-sm rounded-full border-2 border-ink bg-ink px-lg font-button text-button text-background shadow-pop-sm transition-all group-hover:-translate-y-0.5 group-hover:bg-lime group-hover:text-ink">
                  Report a New Item
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </span>
              </button>
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