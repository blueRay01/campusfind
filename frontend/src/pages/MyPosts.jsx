import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"

// Placeholder data — will come from backend later
const myPosts = [
  {
    id: 1,
    title: "Apple AirPods Case",
    location: "Main Library, 2nd Floor",
    date: "Oct 12, 2023",
    status: "ACTIVE",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZHSqbVNz3VzEfDKsxQWmdf1eoGpB1KlhsteWj1wNSvLU5iJyKIdJ95KEEia9jRXQaLujeSpiaanmzqhafcysFhO-hWYyi5rVP7XF5GyDbNfMuL1IPaANc7suWNWKk5jGTwhZsbJVuXjuzzpRgs6U333pXsJvRm-1pSGjkYFFW8q68ZZ6sjSb__m_e3ICteCn04cN68zMWThZNd50IMCdNysZnxebpqD-46XS7gAEMkNc2oWW4m168Y5xnFjDxwhV8ovSrFMfD0P4"
  },
  {
    id: 2,
    title: "Silver Dell Laptop",
    location: "Engineering Hub, Room 402",
    date: "Oct 10, 2023",
    status: "ACTIVE",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVq4sHQ9Dwy8TJxgWmrJCwc_3tAclAt0ejJUsUVN5NXS0N8f5hfM-3Y2vCWL4q04h3ORIdaqeqWEiEDe7DmcihMZuTOQ9zZJ5m0diQTl0S3VjAKljo_MC9rjrtE69MpgUrZSwJoGJtze7TY2n7iHcNrerBX6B1AU4XMageSDt6fA_96Mj7QbgeuQfwomI7LAN6NS_7gbNepaooGjXK9ZpQkLSbD3280PJ6H76EyMmsgB8hG66z-Zh9n1P9xGFnfv-tvv6emSIinF0"
  },
  {
    id: 3,
    title: "Keychain with Blue Fob",
    location: "Student Union Cafeteria",
    date: "Oct 05, 2023",
    status: "RESOLVED",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkVtEav8yPzutE4XcLBhaDM0Kc-ugC_xRkhECKDZDnhSfmzssJwe9oaoQxbBiHbqdgkPHLsciAP_BpgQKLMPTPUs_WbRNn0plkfRMI-YNKkE__KbBxtbk9MST3CHoT1DAHm1yo3EI0GsOcBuGNzKwqE41yaJ4J3FJcbIfO6AQxIK7bmtFhoCRGzlktq0-iMrXf-lC_AvQ0eubhyVFr0JRLk-YoV-mCfSXB2lX_2Mo17ozdSaYq93rutHXmVvd5lKGOFMeaK7ajJc0"
  },
]

const stats = [
  { icon: "emoji_events", label: "Community Karma", value: "1,240 pts" },
  { icon: "handshake", label: "Successful Returns", value: "15 Items" },
  { icon: "verified", label: "Account Status", value: "Verified Student" },
]

function MyPosts() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("Active")

  const filteredPosts = myPosts.filter(post =>
    activeTab === "Active" ? post.status === "ACTIVE" : post.status === "RESOLVED"
  )

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <NavBar />

      <div className="flex">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className={`flex-1 p-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <div className="max-w-[1100px] mx-auto">

            {/* Page header */}
            <div className="flex justify-between items-end mb-xl">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">My Reported Items</h2>
                <p className="text-secondary font-body-lg mt-xs">Manage the items you've found or lost on campus.</p>
              </div>

              {/* Tab toggle */}
              <div className="flex bg-surface-container-low rounded-full p-xs">
                <button
                  onClick={() => setActiveTab("Active")}
                  className={`px-md py-sm rounded-full font-button text-button transition-colors ${activeTab === "Active" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-primary"}`}
                >
                  Active ({myPosts.filter(p => p.status === "ACTIVE").length})
                </button>
                <button
                  onClick={() => setActiveTab("Resolved")}
                  className={`px-md py-sm rounded-full font-button text-button transition-colors ${activeTab === "Resolved" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-primary"}`}
                >
                  Resolved ({myPosts.filter(p => p.status === "RESOLVED").length})
                </button>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className={`bg-white rounded-lg border border-surface-container-highest overflow-hidden hover:shadow-lg transition-all duration-300 group ${post.status === "RESOLVED" ? "opacity-80 hover:opacity-100" : ""}`}
                >
                  {/* Image */}
                  <div className={`relative h-48 overflow-hidden ${post.status === "RESOLVED" ? "grayscale group-hover:grayscale-0 transition-all duration-500" : ""}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-md left-md">
                      <span className={`px-md py-1 text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm ${post.status === "ACTIVE" ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-secondary-container text-on-secondary-container"}`}>
                        {post.status}
                      </span>
                    </div>
                    {post.status === "RESOLVED" && (
                      <div className="absolute inset-0 bg-secondary/10 pointer-events-none" />
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-lg">
                    <div className="flex justify-between items-start mb-sm">
                      <h3 className="font-headline-md text-headline-md text-primary">{post.title}</h3>
                      <span className="text-secondary">
                        <span className="material-symbols-outlined text-[18px]">
                          {post.status === "RESOLVED" ? "check_circle" : "more_vert"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-xs mb-lg">
                      <div className="flex items-center gap-xs text-secondary text-body-sm">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {post.location}
                      </div>
                      <div className="flex items-center gap-xs text-secondary text-body-sm">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {post.date}
                      </div>
                    </div>

                    {/* Actions */}
                    {post.status === "ACTIVE" ? (
                      <div className="grid grid-cols-3 gap-sm pt-md border-t border-surface-container-low">
                        <button className="flex flex-col items-center gap-1 py-sm hover:bg-surface-container-low rounded-lg transition-colors group/btn">
                          <span className="material-symbols-outlined text-secondary group-hover/btn:text-primary">edit</span>
                          <span className="text-[10px] font-bold text-secondary group-hover/btn:text-primary">EDIT</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 py-sm hover:bg-error-container rounded-lg transition-colors group/btn">
                          <span className="material-symbols-outlined text-secondary group-hover/btn:text-error">delete</span>
                          <span className="text-[10px] font-bold text-secondary group-hover/btn:text-error">DELETE</span>
                        </button>
                        <button
                          onClick={() => navigate(`/item/${post.id}`)}
                          className="flex flex-col items-center gap-1 py-sm hover:bg-primary-fixed rounded-lg transition-colors group/btn"
                        >
                          <span className="material-symbols-outlined text-secondary group-hover/btn:text-primary">visibility</span>
                          <span className="text-[10px] font-bold text-secondary group-hover/btn:text-primary">DETAILS</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-md border-t border-surface-container-low flex justify-center">
                        <span className="text-label-caps text-secondary font-bold uppercase">Item Claimed & Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* CTA card */}
              <div
                onClick={() => navigate("/report")}
                className="lg:col-span-3 mt-xl p-xxl bg-white rounded-xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center group hover:border-primary hover:bg-primary-fixed/30 transition-all cursor-pointer"
              >
                <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-sm">Found something else?</h3>
                <p className="text-secondary font-body-lg max-w-md mb-xl">Help your fellow students by reporting items you find around campus. It only takes a minute to make someone's day.</p>
                <button className="px-xl py-lg bg-primary text-on-primary font-button text-button rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                  Report a New Item
                </button>
              </div>
            </div>

            {/* Stats section */}
            <div className="mt-xxl grid grid-cols-1 md:grid-cols-3 gap-lg">
              {stats.map(stat => (
                <div key={stat.label} className="bg-surface-container-low p-xl rounded-lg border border-surface-container-highest flex items-center gap-lg">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-label-caps text-secondary uppercase">{stat.label}</p>
                    <p className="font-headline-md text-headline-md text-primary">{stat.value}</p>
                  </div>
                </div>
              ))}
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