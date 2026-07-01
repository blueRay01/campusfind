import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import ItemCard from "../components/ItemCard"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"


const categories = ["All Items", "Tech", "Documents", "Clothing"]

function Feed() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Items")
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await api.get('/posts')
      setPosts(response.data)
    }
    fetchPosts()
  }, [])

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <NavBar />

      <div className="flex">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main content — margin shifts when sidebar collapses */}
        <main className={`flex-1 p-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <div className="max-w-[1100px] mx-auto">

            {/* Page header and category filters */}
            <header className="mb-xl flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Campus Feed</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Helping you reunite with your lost belongings.</p>
              </div>
              <div className="flex gap-sm flex-wrap">
                {categories.map(cat => (
                  <span
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full font-label-caps text-label-caps cursor-pointer transition-colors ${activeCategory === cat ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-primary/10"}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </header>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
              {posts.map(post => (
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