import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import NavBar from "../components/NavBar"
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

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
]

function Feed() {
  const { isLoggedIn } = useAuth()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [sortBy, setSortBy] = useState("newest")
  const [posts, setPosts] = useState([])


  const visiblePosts = posts
    .filter(post => !post.is_claimed)
    .filter(post => activeCategory === "All Items" || post.category === activeCategory)
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await api.get('/posts')
      setPosts(response.data)   
    }
    fetchPosts()
  }, [isLoggedIn])
  

 return (
    <div className="bg-background text-on-surface min-h-screen">
      <NavBar />

      <div className="flex">
        <SideBar />

        <main className="flex-1 pl-[150px] pr-[120px] py-[120px] min-h-[calc(100vh-64px)] bg-background transition-all duration-300">
          <div>

            {/* Page header and filters */}
            <header className="mb-xl flex justify-between items-end">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-md py-sm pr-10 bg-background border border-transparent focus:border-black rounded-full font-body-lg focus:outline-none transition-all appearance-none text-body-lg"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="px-md py-sm pr-10 bg-background border border-transparent focus:border-black rounded-full font-body-lg focus:outline-none transition-all appearance-none text-body-lg"
                  >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </header>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-xxl">
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