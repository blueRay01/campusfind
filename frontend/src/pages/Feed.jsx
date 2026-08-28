import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import ItemCard from "../components/ItemCard"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"


const categories = [
  "All Items",
  "Electronics",
  "Water Bottles",
  "Wallets / IDs",
  "Clothing / Apparel",
  "Books / Notebooks",
  "Keys",
  "Other",
]

function Feed() {
  const { isLoggedIn } = useAuth()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [collapsed, setCollapsed] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [posts, setPosts] = useState([])

  const visiblePosts = posts
    .filter(post => !post.is_claimed)
    .filter(post => activeCategory === "All Items" || post.category === activeCategory)
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await api.get('/posts')
      setPosts(response.data)
    }
    fetchPosts()
  }, [isLoggedIn])
  

  return (
    <div className="bg-background text-on-surface min-h-screen">
      
      <Navbar />

      <div className="flex">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content — margin shifts when sidebar collapses */}
        <main className={`flex-1 p-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300 ${!isLoggedIn ? "" : collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <div className="max-w-[1100px] mx-auto">

            {/* Page header and category filter */}
            <header className="mb-xl flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Campus Feed</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {searchQuery ? `Showing results for "${searchQuery}"` : "Helping you reunite with your lost belongings."}
                </p>
              </div>
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">CATEGORY</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="px-md py-sm bg-surface-container-high border-none rounded-full font-body-lg focus:ring-2 focus:ring-primary transition-all appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </header>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
              {visiblePosts.map(post => (
                <ItemCard
                  key={post.id}
                  id={post.id} 
                  title={post.title}
                  location={`${post.building}${post.room ?`, ${post.room}` : ''}`}
                  category={post.category}
                  image={post.image_url}
                />
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

export default Feed