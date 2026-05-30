import { useState } from "react"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import ItemCard from "../components/ItemCard"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"

// Placeholder data — later this will come from your backend API
const posts = [
  { id: 1, title: "iPhone 14 Pro", location: "Science Building, Lab 402", category: "LOST", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZkF9brSUmAIxQe2Zw7CT5omW5mUgrNwY_HYK3pk3JWdqF1Qb2qlWCjUDPWvRRjXaL9xNOfLFLYi7DgtDoLNBqKp0A90q2d6_00h4MBborSuJxXgqjqPnpZunoJSaiQQB27O6Xbdo37n0vRVizGdgPN959k9xu5YDMSpQQbVZAmgPLPUQA8sqivgGjba8LTi6LOcIAcuXmn-zvTKdXhYa8ULnthrjr0eLNJWJ4xC2508Q66L0dybro4O8XOILoQni8m4PlDLzZhyo" },
  { id: 2, title: "Set of Car Keys", location: "Student Union Cafe", category: "FOUND", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVHiHwGn0PgGAX58y35Fm39VJ9iKxCh3REJqZBjkyQMNagitAMJjVCfh4_JmfpWZA_pEkyyvzYCtpFw82_35qYvdX_XXSjVmuzFQ8gSFUdK0r9xy8srBcyON0TQXP16R_-s9qMZMIFQK25iwcuRc81985KRGd-qlwV9dhxarsMZkQqV9-ObnFFCPiSKl_6El4zelzN2kPAAGpjAw0dzwI5eLUluZ_Gu5awJHbnHPnr3aahpZbAIXCk5i9EBu52o23wCEYgcdmbK-o" },
  { id: 3, title: "Organic Chemistry", location: "Main Library, 2nd Floor", category: "LOST", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgtQ1V8FrZeG1EczulQh7kpYgVdfLk0MbbceA3d1MLuHBMJmjnzTyf3V8I16m3Wvihvm6WV8v9c1_D6DKN0wXGN5O-eo3GPHIxoFNaY6mcDLo8Pcqxv-8gfBEo9bEyNg02hlHZ1ZSWylR6WZe0VRWfHtChc70u92wUrCIwBQthcZjBJLNWKG597dpcEZ6-A3fsJiNT26uaTBulefE-tahErdEdZhmscWCILBPnYopmMnako1j2OiVVqHKDgkNxyQwn82QUwLwsBkI" },
  { id: 4, title: "Analog Wristwatch", location: "Gymnasium Locker Room", category: "FOUND", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1TSDGCt9ZB-cLLa48OBe5HaWelQXw1MVValFgx9HwfJHCYRXn13mXq3ctxavMZpCHYWpSBeJd9LI98u682uu-jxygqgRahakwW_1cOtWybkMRGREXMCOZU9i_F7LoAW4Vq96qrFuwnMNjFEQWzWfOUDc38sTDhYRA13eAnlMMDxy5Qj9yQkqhjfQjZ_o55sDU-y9kHy6IrniV6jbETQe1sBAK8K2j10oRu3_MzSYfQ4cKHns_oZIplHqv0wolv7YOc-FAfG69tsg" },
  { id: 5, title: "Herschel Backpack", location: "Humanities Annex", category: "FOUND", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmnUznt6DltlhFSbVAn3vxSemkeXb9L60mgEn2sFuM_NmbUDWXzaw6zdCScgbdXV35XwxM2_tJdTPyqFKgDJwkdnlVkP-w28zgzCS9b9r0MgEXgfugr2CMGg55ckiT1oteDpajKrBYPkpLqoBX3Hn4k8Zn0kpTuhwHJnBDBfcH94TrxL7oSc-zWICACdSmSPC0Q1VrvsTZ607OSwRz-M0flDixHqL4UTFHp0toKnuZbxvDRMY0DFfYA-DnnkAoIQMmPivORn3sYXg" },
  { id: 6, title: "Sony Headphones", location: "Architecture Studio", category: "LOST", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmLsmHK2TkvfkoHNAdDxldhiPtxR-Ji6UL_eID5ufc5CvZavv4TP8P28KJwQ7uFLJsO1mO3Zb__uH5w_5xSBPHIRi41-du1uO0itJIhH3oXL2_JdNKDtgQ-A8k6SGNXvvksTSlDcYwhKzyQxGGWH9qJ-LdlVwf-_UF0-fd-klQvs76XqXZwZhbicOof0uMhR3nQlFuAsjjS5Ls56xqkSSPOPl2inPZ-n_swe93gblkQ1fesZvb7hZg7xCzwwJt5CHQRDeWnEDysL8" },
]

const categories = ["All Items", "Tech", "Documents", "Clothing"]

function Feed() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Items")

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
                  location={post.location}
                  category={post.category}
                  image={post.image}
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