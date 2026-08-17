import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"

const buildings = [
  "BLDG. 1 - Arts and Culture Building",
  "BLDG. 2 - Guidance and Testing Center",
  "BLDG. 3 - College of Medicine",
  "BLDG. 5 - Old Engineering Building",
  "BLDG. 9 - ICT Building",
  "BLDG. 10 - Administration Building",
  "BLDG. 14 - Finance and Accounting Building / Senior High School Building",
  "BLDG. 15 - Gymnasium Lobby",
  "BLDG. 16 - Gymnasium / DRER Memorial Hall",
  "BLDG. 18 - Culinary Building",
  "BLDG. 19 - NSTP Building",
  "BLDG. 20 - Cafeteria",
  "BLDG. 21 - Guard House",
  "BLDG. 23 - Learning Resource Center",
  "BLDG. 24 - Girl's Trade Building",
  "BLDG. 25 - Food Innovation Center",
  "BLDG. 26 - Food Innovation Center",
  "BLDG. 27 - University Health Center / OSA",
  "BLDG. 28 - Old Science Building",
  "BLDG. 35 - Old Education Building",
  "BLDG. 36 - Old Student Center",
  "BLDG. 41 - Science Complex",
  "BLDG. 42 - Engineering Complex I (Right Wing)",
  "BLDG. 43 - Engineering Complex II (Left Wing)",
  "BLDG. 44 - Student Center and Education Complex",
  "BLDG. 45 - Mechanical Laboratory Shop",
  "BLDG. 47 - Technology Building",
  "BLDG. 50 - Faculty Learning Resource Center",
  "BLDG. 51 - Dormitory",
  "BLDG. 52 - Fab Lab Building",
]

const categories = [
  "Electronics",
  "Water Bottles",
  "Wallets / IDs",
  "Clothing / Apparel",
  "Books / Notebooks",
  "Keys",
  "Other",
]

function ReportItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id)
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [handedToSecurity, setHandedToSecurity] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  // Form fields
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [building, setBuilding] = useState("")
  const [room, setRoom] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [description, setDescription] = useState("")

  // In edit mode, fetch the existing post and pre-fill every field
  useEffect(() => {
    if (!isEditMode) return

    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`)
        const post = response.data
        setItemName(post.title || "")
        setCategory(post.category || "")
        setBuilding(post.building || "")
        setRoom(post.room || "")
        setHandedToSecurity(post.handed_to_security || false)
        setPickupLocation(post.pickup_location || "")
        setDescription(post.description || "")
        setPreview(post.image_url || null)
      } catch (err) {
        setError("Failed to load this item for editing.")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id, isEditMode])

  // Clear pickup location whenever "handed to security" gets checked
  useEffect(() => {
    if (handedToSecurity) {
      setPickupLocation("")
    }
  }, [handedToSecurity])

  const handleFileChange = (file) => {
    if (file) {
      setPreview(URL.createObjectURL(file))
      setImage(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!handedToSecurity && !pickupLocation.trim()) {
      setError("Please either check 'Handed to Security' or provide a pickup location.")
      return
    }
    const formData = new FormData()
    formData.append('itemName', itemName)
    formData.append('category', category)
    formData.append('building', building)
    formData.append('room', room)
    formData.append('handedToSecurity', handedToSecurity)
    formData.append('pickupLocation', pickupLocation)
    formData.append('description', description)
    // Only attach the image if the user selected a new one —
    // in edit mode, no new file means "keep the existing image"
    if (image) {
      formData.append('image', image)
    }

    try {
      if (isEditMode) {
        await api.patch(`/posts/${id}`, formData)
      } else {
        await api.post('/posts', formData)
      }
      navigate('/my-posts')
    } catch (error) {
      setError(isEditMode ? 'Failed to update item. Please try again' : 'Failed to report item. Please try again')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <NavBar />

      <div className="flex">
        <SideBar />

        <main className="flex-1 pl-[150px] pr-[120px] py-[120px] min-h-[calc(100vh-64px)] bg-background transition-all duration-300">
          <div className="max-w-[1100px] mx-auto">

            {/* Page header */}
            <div className="mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">
                {isEditMode ? "Edit Reported Item" : "Report a Found Item"}
              </h2>
              <p className="text-secondary font-body-lg">
                {isEditMode ? "Update the details of your reported item." : "Help reconnect a fellow student with their lost belongings. Please provide as much detail as possible."}
              </p>
            </div>

            {/* Form grid */}
            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-lg">

              {/* Left column */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-lg">

                {/* Basic info card */}
                <div className="bg-background p-xl">
                  <div className="flex flex-col gap-lg">

                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">ITEM NAME</label>
                      <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="e.g. Blue HydroFlask, Black AirPods Case"
                        required
                        className="w-full px-md py-sm bg-surface-container-low border border-black font-body-lg focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">CATEGORY</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-md py-sm bg-surface-container-low border border-black font-body-lg focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">DESCRIPTION (OPTIONAL)</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Any distinguishing details — color, brand, stickers, condition, etc."
                        rows={4}
                        className="w-full px-md py-sm bg-surface-container-low border border-black font-body-lg focus:ring-2 focus:ring-primary transition-all resize-none"
                      />
                    </div>

                  </div>
                </div>

                {/* Location card */}
                <div className="bg-background p-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

                    <div className="md:col-span-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">WHERE ITEM WAS FOUND — BUILDING</label>
                      <select
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        required
                        className="w-full px-md py-sm bg-background border border-black font-body-lg focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="">Select a building</option>
                        {buildings.map(b => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">FLOOR / ROOM</label>
                      <input
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        placeholder="e.g. 2nd Floor, Room 204"
                        className="w-full px-md py-sm bg-background border border-black font-body-lg focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-md h-full pt-lg">
                      <label className="flex items-center gap-sm cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={handedToSecurity}
                          onChange={(e) => setHandedToSecurity(e.target.checked)}
                          className="w-6 h-6 rounded-lg border-2 border-outline-variant text-primary focus:ring-primary-container"
                        />
                        <span className="font-body-sm text-on-surface-variant group-hover:text-primary transition-colors">
                          Handed to Security / Guard
                        </span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">
                        PICKUP LOCATION {handedToSecurity ? "(not needed — handed to security)" : "(optional)"}
                      </label>
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        disabled={handedToSecurity}
                        placeholder="e.g. Meet at the Library entrance, 3rd Floor Lounge"
                        className={`w-full px-md py-sm border border-black rounded-full font-body-lg focus:ring-2 focus:ring-primary transition-all ${handedToSecurity ? "bg-surface-container-highest text-on-surface-variant cursor-not-allowed" : "bg-surface-container-low"}`}
                      />
                    </div>

                  </div>
                </div>

              </div>

              {/* Right column */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">

                {/* Image upload zone */}
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} 
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`bg-surface-container-lowest p-lg border flex flex-col items-center justify-center min-h-[340px] text-center cursor-pointer transition-all group ${dragOver ? "border-primary bg-primary-fixed/30" : "border-black hover:border-primary"}`}
                >
                  {preview ? (
                    <div className="w-full h-full relative">
                      <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                      <p className="font-body-sm text-on-surface-variant mt-md">Click to change photo</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-primary mb-xs">Upload Photo</h4>
                      <p className="font-body-sm text-on-surface-variant px-xl">Drag and drop an image or click to browse. Clear photos help owners identify items faster.</p>
                    </>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col gap-md mt-auto">
                  <p className="font-body-sm text-on-surface-variant text-center px-lg">
                    By submitting this report, you agree to our Terms of Service and helping the campus community.
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary py-lg font-button text-body-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    {isEditMode ? "Save Changes" : "Submit Report"}
                  </button>
                  {error && <p className='text-red-500 text-sm'>{error}</p>}
                  <button
                    type="button"
                    onClick={() => navigate(isEditMode ? "/my-posts" : "/feed")}
                    className="w-full bg-surface-container-high text-on-surface py-lg font-button text-body-lg hover:bg-surface-container-highest transition-all"
                  >
                    Cancel
                  </button>
                </div>

              </div>

            </form>
          </div>
        </main>
      </div>
      <Footer />
      <BottomNav />

    </div>
  )
}

export default ReportItem