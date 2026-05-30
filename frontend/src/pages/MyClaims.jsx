import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"

const claims = [
  {
    id: 1,
    title: 'MacBook Pro 14" (Space Gray)',
    location: "Student Union Lounge, Table 4",
    status: "READY FOR PICKUP",
    pickupLocation: "Campus Security Main Office",
    pickupHours: "Mon-Fri: 8:00 AM - 6:00 PM",
    featured: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCT_pBTPYNrUb_8VDsBfyT5sW92_6IwtEXNxoSInVzmC_b41KRMQixAmppRVflbVwz7kP5S5zfBSqaTQHfgGDW8W5PWbe_ZdQxGufQaPujNxIX8-LlHI8wssrhzUH2RfRfUDVKeRf0v8kI1EZHG5DwH6FZMjNjEI42k3-H-nUQIcQ5BRCDAc6cyh9kRWY2wyKTMVUX1MnY5pOCQQdvOnUlexA5HyAYs4HDsLB7P74XlH37zgKwENkazqWkJvD2lgpISwIsnqf3bBQ"
  },
  {
    id: 2,
    title: "Leather Keychain with 3 Keys",
    location: "Main Library, Level 2",
    status: "PENDING VERIFICATION",
    note: "Admin is reviewing your ownership details...",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIo8pH-EoqTbEpfE6USC1F-QQikbFFudTU6x4WCLH0bjPrBrzdiAy24oATew-17vKJEfk8bBDWw7H8VE9G9p7LRsFn9UgYHhlJ7iB0Eo90SP88MMi_Re7bAIOAZj-BXmwFcN79TUfhvWzXOxSIIUuDK0D5oLtbCOBL2lPb2Dra3rRXUjo_OtmBaUoFOJkIO9VCBhPC_L1aKqDrTqG09VIdC_uBIh1RzLoVdHqii0t7IMrVe8RpmyCIap0sWjtKP565K4bzHrL8AcI"
  },
  {
    id: 3,
    title: "White Hydroflask",
    location: "Returned: Oct 12, 2024",
    status: "RESOLVED",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyELjwjWWXbPoZUdFuf3KVsvosDxFJNTz86ilvyulF-Hr1181ovV4Z9_J70TdYKK_vjmc4roLaVfYkjxXj7xh4eIONhhxwwI6Z8l3vKH2VAcX32pcXJrX5Uo8pM7QEoCgDCSlKBBAjStodJxv1ofs1tHB7InT3qDvsNuVpRMcu1x8NyX0UyrGAN4AmkJjBP6CI-hL33kIFb8bSVjd_ksWGvxsfdmBVGYHNEWZhaopxHxSTvx4lWFYtxpQyS89iLKnwHgE2Tihk4fA"
  },
  {
    id: 4,
    title: "Blue Herschel Backpack",
    location: "Engineering Hall, Rm 202",
    status: "PENDING VERIFICATION",
    note: "Ownership proof requested.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADrMU28t91xW4x83fEJfsWr9JQ-26Wk5d0gnQ--WRLaoKtjQ8N7yd5SboEQAJsZ_kiGOdQfvCt1ZU7IoT5_9tNlDTpojIaFDGH5nWYS14KROBvEqma5eSWSetk5iUu8LtMa4ZE8_ZlKqEL6EH9WUI8ucOY1NbiIUr8PLGPmiuMXGQJ9uO0uqvHfYqrA5KKAcE_6-YQgTjX5us6e81esfn4aXctYqLaJkUyyxjZH5dJRDTxsQSOsAic02kHD6yIr_oLvd1CVpQoA2Q"
  },
]

const badgeStyle = {
  "READY FOR PICKUP": "bg-primary-fixed text-on-primary-fixed-variant",
  "PENDING VERIFICATION": "bg-secondary-container text-on-secondary-container",
  "RESOLVED": "bg-surface-container-highest text-secondary",
}

function MyClaims() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const featuredClaim = claims.find(c => c.featured)
  const otherClaims = claims.filter(c => !c.featured)

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <NavBar />

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
              <div className="flex gap-sm">
                <span className="px-md py-sm bg-surface-container-high rounded-full text-label-caps text-on-surface-variant border border-outline-variant cursor-pointer">
                  Filter: All
                </span>
                <span className="px-md py-sm bg-surface-container-high rounded-full text-label-caps text-on-surface-variant border border-outline-variant cursor-pointer">
                  Sort: Recent
                </span>
              </div>
            </div>

            {/* Claims grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">

              {/* Featured card — spans 2 columns */}
              {featuredClaim && (
                <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest border border-surface-container-highest rounded-xl p-lg flex flex-col md:flex-row gap-lg hover:border-primary-fixed-dim hover:bg-white transition-all group">
                  <div className="w-full md:w-56 h-56 rounded-lg overflow-hidden relative flex-shrink-0">
                    <img
                      src={featuredClaim.image}
                      alt={featuredClaim.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-sm right-sm bg-primary-fixed text-on-primary-fixed px-md py-xs rounded-full font-label-caps text-[10px] shadow-sm">
                      READY FOR PICKUP
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="mb-auto">
                      <h3 className="font-headline-md text-headline-md text-primary mb-xs">{featuredClaim.title}</h3>
                      <div className="flex items-center gap-sm text-secondary mb-md">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="font-body-sm text-body-sm">{featuredClaim.location}</span>
                      </div>
                      <div className="bg-surface-container-low p-md rounded-lg border border-surface-container-highest mb-lg">
                        <p className="font-label-caps text-secondary mb-xs">PICKUP LOCATION</p>
                        <p className="font-body-sm text-on-surface font-semibold">{featuredClaim.pickupLocation}</p>
                        <p className="font-body-sm text-secondary">{featuredClaim.pickupHours}</p>
                      </div>
                    </div>
                    <button className="w-full py-md bg-primary text-on-primary rounded-full font-button text-button flex items-center justify-center gap-md hover:opacity-90 active:scale-95 transition-all shadow-md">
                      <span className="material-symbols-outlined text-lg">qr_code_2</span>
                      Show Pickup QR Code
                    </button>
                  </div>
                </div>
              )}

              {/* Other claim cards */}
              {otherClaims.map(claim => (
                <div
                  key={claim.id}
                  className={`bg-surface-container-lowest border border-surface-container-highest rounded-xl p-lg flex flex-col hover:bg-white transition-all ${claim.status === "RESOLVED" ? "opacity-80" : ""}`}
                >
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-md relative">
                    <img
                      src={claim.image}
                      alt={claim.title}
                      className={`w-full h-full object-cover ${claim.status === "RESOLVED" ? "grayscale" : ""}`}
                    />
                    <div className={`absolute top-sm right-sm px-md py-xs rounded-full font-label-caps text-[10px] ${badgeStyle[claim.status]}`}>
                      {claim.status}
                    </div>
                  </div>

                  <h3 className={`font-button text-button mb-xs ${claim.status === "RESOLVED" ? "text-on-surface-variant line-through" : "text-primary"}`}>
                    {claim.title}
                  </h3>

                  <div className="flex items-center gap-sm text-secondary mb-md">
                    <span className="material-symbols-outlined text-sm">
                      {claim.status === "RESOLVED" ? "calendar_today" : "location_on"}
                    </span>
                    <span className="font-body-sm text-body-sm">{claim.location}</span>
                  </div>

                  <div className="mt-auto pt-md border-t border-surface-container-highest">
                    {claim.status === "RESOLVED" ? (
                      <button className="w-full py-sm bg-surface-variant text-on-surface-variant rounded-full font-label-caps text-[10px] uppercase hover:bg-surface-container-highest transition-all">
                        View History
                      </button>
                    ) : (
                      <p className="font-body-sm text-secondary italic">Status: {claim.note}</p>
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
          </div>
        </main>
      </div>

      <Footer />
      <BottomNav />

    </div>
  )
}

export default MyClaims