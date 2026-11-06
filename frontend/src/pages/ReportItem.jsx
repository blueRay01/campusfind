import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useToast } from "../context/ToastContext"

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
  const toast = useToast();
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
      toast(isEditMode ? "Changes saved." : "Item reported. Thanks for helping out!")
    } catch (error) {
      setError(isEditMode ? 'Failed to update item. Please try again' : 'Failed to report item. Please try again')
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="flex items-center gap-sm font-body-lg text-body-lg text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading your item...
        </p>
      </div>
    )
  }

  const field =
    "w-full h-12 px-md rounded-2xl border-2 border-ink/20 bg-surface-container-low font-body-lg text-body-lg text-ink placeholder:text-on-surface-variant/80 outline-none transition-all hover:border-ink/40 focus:border-ink focus:bg-surface-container-lowest focus:ring-4 focus:ring-lime/60"
  const label = "block mb-sm font-label-caps text-label-caps uppercase text-on-surface-variant"

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-on-surface">

      <Navbar />

      <div className="flex flex-1">
        <SideBar />

        <main className="flex-1 min-w-0 px-margin-mobile md:px-8 lg:px-12 pt-xl lg:pt-xxl">
          <div className="max-w-[1280px]">

            {/* Page header */}
            <div className="mb-xl">
              <span className={`inline-flex items-center gap-xs rounded-full border-2 border-ink px-3 py-1 font-body-sm text-body-sm font-semibold ${isEditMode ? "bg-violet" : "bg-lime"}`}>
                <span className="material-symbols-outlined text-[18px]">{isEditMode ? "edit" : "add"}</span>
                {isEditMode ? "Editing a post" : "New post"}
              </span>
              <h1 className="mt-md font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1] tracking-[-0.03em] text-ink">
                {isEditMode ? "Edit Reported Item" : "Report a Found Item"}
              </h1>
              <p className="mt-sm max-w-[620px] font-body-lg text-body-lg text-on-surface-variant">
                {isEditMode ? "Update the details of your reported item." : "Help reconnect a fellow student with their lost belongings. Please provide as much detail as possible."}
              </p>
            </div>

            {/* Form grid: on phones the photo comes first, on desktop it sits on the right */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-lg lg:grid-cols-12 lg:gap-xl">

              {/* Photo */}
              <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 p-md text-center transition-all lg:min-h-[400px] ${
                    dragOver
                      ? "border-solid border-ink bg-lime-soft shadow-pop"
                      : preview
                        ? "border-solid border-ink bg-surface-container-lowest"
                        : "border-dashed border-ink/40 bg-surface-container-lowest hover:border-ink hover:bg-violet-soft/40"
                  }`}
                >
                  {preview ? (
                    <div className="relative h-full w-full">
                      <img src={preview} alt="Preview" className="aspect-[4/3] w-full rounded-[20px] object-cover lg:aspect-auto lg:h-[360px]" />
                      <span className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-xs whitespace-nowrap rounded-full border-2 border-ink bg-surface-container-lowest px-md py-1.5 font-body-sm text-body-sm font-semibold shadow-pop-sm">
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        Click to change photo
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="mb-md grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-lime transition-transform group-hover:-rotate-6 group-hover:scale-110">
                        <span className="material-symbols-outlined text-3xl text-ink">add_a_photo</span>
                      </div>
                      <h4 className="mb-xs font-headline-md text-headline-md text-ink">Upload Photo</h4>
                      <p className="max-w-[300px] font-body-sm text-body-sm text-on-surface-variant">
                        Drag and drop an image or click to browse. Clear photos help owners identify items faster.
                      </p>
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
              </div>

              {/* Details */}
              <div className="flex flex-col gap-lg lg:col-span-7 lg:row-span-2 lg:row-start-1">

                {/* What is it */}
                <section className="rounded-[28px] border-2 border-ink bg-surface-container-lowest p-lg sm:p-xl">
                  <div className="mb-lg flex items-center gap-md">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-lime font-display text-[18px] font-bold">1</span>
                    <h2 className="font-headline-md text-headline-md text-ink">What did you find?</h2>
                  </div>

                  <div className="flex flex-col gap-lg">
                    <div>
                      <label htmlFor="itemName" className={label}>Item name</label>
                      <input
                        id="itemName"
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="e.g. Blue HydroFlask, Black AirPods Case"
                        required
                        className={field}
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className={label}>Category</label>
                      <div className="relative">
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className={`${field} appearance-none pr-11`}
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat}>{cat}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">expand_more</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className={label}>Description (optional)</label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Any distinguishing details: color, brand, stickers, condition, etc."
                        rows={4}
                        className={`${field} h-auto resize-none py-sm`}
                      />
                    </div>
                  </div>
                </section>

                {/* Where */}
                <section className="rounded-[28px] border-2 border-ink bg-surface-container-lowest p-lg sm:p-xl">
                  <div className="mb-lg flex items-center gap-md">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-violet font-display text-[18px] font-bold">2</span>
                    <h2 className="font-headline-md text-headline-md text-ink">Where was it found?</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-lg md:grid-cols-2">

                    <div className="md:col-span-2">
                      <label htmlFor="building" className={label}>Building</label>
                      <div className="relative">
                        <select
                          id="building"
                          value={building}
                          onChange={(e) => setBuilding(e.target.value)}
                          required
                          className={`${field} appearance-none pr-11`}
                        >
                          <option value="">Select a building</option>
                          {buildings.map(b => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">expand_more</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="room" className={label}>Floor / room</label>
                      <input
                        id="room"
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        placeholder="e.g. 2nd Floor, Room 204"
                        className={field}
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex h-12 w-full cursor-pointer items-center gap-sm rounded-2xl border-2 border-ink/20 px-md transition-all hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:bg-lime-soft">
                        <input
                          type="checkbox"
                          checked={handedToSecurity}
                          onChange={(e) => setHandedToSecurity(e.target.checked)}
                          className="h-5 w-5 shrink-0 cursor-pointer accent-ink"
                        />
                        <span className="font-body-sm text-body-sm font-semibold text-ink">
                          Handed to Security / Guard
                        </span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="pickup" className={label}>
                        Pickup location {handedToSecurity ? "(not needed, handed to security)" : ""}
                      </label>
                      <input
                        id="pickup"
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        disabled={handedToSecurity}
                        placeholder="e.g. Meet at the Library entrance, 3rd Floor Lounge"
                        className={`${field} ${handedToSecurity ? "cursor-not-allowed border-dashed bg-surface-container text-on-surface-variant hover:border-ink/20" : ""}`}
                      />
                      {!handedToSecurity && (
                        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                          Needed unless you handed it to security.
                        </p>
                      )}
                    </div>

                  </div>
                </section>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-md lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-start">
                {error && (
                  <p role="alert" className="flex items-start gap-sm rounded-2xl border-2 border-error bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-sm rounded-full border-2 border-ink bg-lime font-button text-body-lg font-bold text-ink shadow-pop transition-all hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0 active:shadow-none"
                >
                  {isEditMode ? "Save Changes" : "Submit Report"}
                  <span className="material-symbols-outlined text-[20px]">{isEditMode ? "check" : "arrow_forward"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(isEditMode ? "/my-posts" : "/feed")}
                  className="h-14 w-full rounded-full border-2 border-ink bg-transparent font-button text-body-lg text-ink transition-colors hover:bg-surface-container-lowest"
                >
                  Cancel
                </button>
                <p className="px-md text-center font-body-sm text-body-sm text-on-surface-variant">
                  By submitting this report, you agree to our Terms of Service and helping the campus community.
                </p>
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