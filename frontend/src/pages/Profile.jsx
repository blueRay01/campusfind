import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
// Name can only be changed once every 30 days


const NAME_CHANGE_COOLDOWN_DAYS = 30

function getDaysUntilNextChange(lastChanged) {
  if (!lastChanged) return 0
  const diff = Date.now() - new Date(lastChanged).getTime()
  const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24))
  return Math.max(0, NAME_CHANGE_COOLDOWN_DAYS - daysPassed)
}

function Profile() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [nameError, setNameError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [messengerLink, setMessengerLink] = useState('')
  const [editingMessenger, setEditingMessenger] = useState(false)

  useEffect(() => {
    const fetchProfile = async() => {
      const response = await api.get('/auth/my') 
      setUser(response.data)
      setNewName(response.data.name)
    }
    fetchProfile()
  }, [])

  const handleMessengerSave = async () => {
    const update = await api.patch('/auth/my', {messenger_link: messengerLink})
    setUser(prev => ({ ...user, messenger_link: update.data.messenger_link}))
  }

  const daysUntilChange = getDaysUntilNextChange(user.lastNameChange)
  const canChangeName = daysUntilChange === 0

  const handleNameSave = () => {
    if (!newName.trim()) {
      setNameError("Name cannot be empty.")
      return
    }
    if (newName.trim().length < 2) {
      setNameError("Name must be at least 2 characters.")
      return
    }
    if (!canChangeName) {
      setNameError(`You can change your name again in ${daysUntilChange} days.`)
      return
    }

    setUser(prev => ({
      ...prev,
      name: newName.trim(),
      lastNameChange: new Date().toISOString()
    }))
    setEditingName(false)
    setNameError("")
    triggerSuccess("Display name updated successfully.")
  }

  

  const triggerSuccess = (message) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3500)
  }

  return (
    <div className="bg-background text-on-surface min-h-screen">

      <NavBar />

      <div className="flex">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className={`flex-1 p-margin-desktop min-h-[calc(100vh-64px)] bg-background transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
          <div className="max-w-[800px] mx-auto">

            {/* Page header */}
            <div className="mb-xl">
              <h1 className="font-headline-lg text-headline-lg text-primary">My Profile</h1>
              <p className="font-body-lg text-on-surface-variant">Manage your account information.</p>
            </div>

            {/* Avatar and name section */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl mb-lg flex flex-col sm:flex-row items-center sm:items-start gap-lg">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-4xl font-bold select-none">
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-container transition-colors shadow-md">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              {/* Name and basic info */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-sm mb-xs flex-wrap">
                  {editingName ? (
                    <div className="flex flex-col gap-xs w-full">
                      <div className="flex gap-sm">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => { setNewName(e.target.value); setNameError("") }}
                          className="flex-1 px-md py-sm bg-surface-container-low rounded-full border-none focus:ring-2 focus:ring-primary-container font-body-lg text-on-surface"
                          autoFocus
                        />
                        <button
                          onClick={handleNameSave}
                          className="px-md py-sm bg-primary text-white rounded-full font-button text-button hover:bg-primary-container transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingName(false); setNewName(user.name); setNameError("") }}
                          className="px-md py-sm bg-surface-container-high text-on-surface rounded-full font-button text-button hover:bg-surface-container-highest transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      {nameError && (
                        <p className="font-body-sm text-error px-sm">{nameError}</p>
                      )}
                      {!canChangeName && (
                        <p className="font-body-sm text-on-surface-variant px-sm">
                          You can change your name again in {daysUntilChange} days.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-sm">
                      <h2 className="font-headline-md text-headline-md text-primary">{user.name}</h2>
                      <button
                        onClick={() =>
                           setEditingName(true)}
                        className="p-xs hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary"
                        title={canChangeName ? "Edit name" : `Name change available in ${daysUntilChange} days`}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-sm mt-sm">
                  <span className="px-md py-xs bg-primary-fixed text-on-primary-fixed-variant rounded-full font-label-caps text-label-caps">
                    {user.course}
                  </span>
                  <span className="px-md py-xs bg-surface-container-high text-on-surface-variant rounded-full font-label-caps text-label-caps">
                    Joined {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            {/* <div className="grid grid-cols-3 gap-lg mb-lg">
              {[
                { label: "Items Reported", value: user.stats.reported, icon: "inventory_2" },
                { label: "Successfully Returned", value: user.stats.returned, icon: "handshake" },
                { label: "Claims Made", value: user.stats.claims, icon: "front_hand" },
              ].map(stat => (
                <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col items-center text-center gap-sm">
                  <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                  </div>
                  <p className="font-headline-md text-headline-md text-primary">{stat.value}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">{stat.label}</p>
                </div>
              ))}
            </div> */}

            {/* Account details — read only fields */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl mb-lg">
              <h3 className="font-headline-md text-headline-md text-primary mb-lg">Account Details</h3>
              <div className="flex flex-col gap-md">

                {[
                  { label: "Student ID", value: user.student_id, icon: "badge", editable: false, note: "Cannot be changed." },
                  { label: "Email Address", value: user.email, icon: "mail", editable: false, note: "Contact support to change your email." },
                  { label: "Course", value: user.course, icon: "school", editable: false, note: "Contact your registrar to update." },
                ].map(field => (
                  <div key={field.label} className="flex items-start gap-md p-md bg-surface-container-low rounded-xl">
                    <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant">{field.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{field.label}</p>
                      <p className="font-body-lg text-on-surface">{field.value}</p>
                      <p className="font-body-sm text-on-surface-variant/70 mt-xs">{field.note}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-md p-md bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant">link</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">Facebook Link</p>

                    {editingMessenger ? (
                      <div className="flex flex-col gap-xs">
                        <div className="flex gap-sm">
                          <input
                            type="text"
                            value={messengerLink}
                            onChange={(e) => setMessengerLink(e.target.value)}
                            className="flex-1 px-md py-sm bg-surface-container-lowest rounded-full border-none focus:ring-2 focus:ring-primary-container font-body-lg text-on-surface"
                            autoFocus
                          />
                          <button
                            onClick={async () => {
                              await handleMessengerSave()
                              setEditingMessenger(false)
                              triggerSuccess("Facebook link updated successfully.")
                            }}
                            className="px-md py-sm bg-primary text-white rounded-full font-button text-button hover:bg-primary-container transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setMessengerLink(user.messenger_link)
                              setEditingMessenger(false)
                            }}
                            className="px-md py-sm bg-surface-container-high text-on-surface rounded-full font-button text-button hover:bg-surface-container-highest transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-sm">
                        <p className="font-body-lg text-on-surface">{user.messenger_link || "Not set"}</p>
                        <button
                          onClick={() => 
                            { setMessengerLink(user.messenger_link) 
                              setEditingMessenger(true)}}
                          className="p-xs hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-primary"
                          title="Edit Facebook link"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Password section */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl mb-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">Password</h3>
                  <p className="font-body-sm text-on-surface-variant mt-xs">Last changed: Never</p>
                </div>
                <button className="px-lg py-sm bg-surface-container-high text-on-surface rounded-full font-button text-button hover:bg-surface-container-highest transition-colors">
                  Change Password
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-error-container border border-error/20 rounded-xl p-xl mb-xxl">
              <h3 className="font-headline-md text-headline-md text-error mb-xs">Danger Zone</h3>
              <p className="font-body-sm text-on-surface-variant mb-lg">These actions are permanent and cannot be undone.</p>
              <div className="flex flex-col sm:flex-row gap-sm">
                <button
                  onClick={() => navigate("/")}
                  className="px-lg py-sm bg-surface-container-lowest border border-outline-variant text-on-surface rounded-full font-button text-button hover:bg-surface-container-low transition-colors"
                >
                  Log Out
                </button>
                <button className="px-lg py-sm bg-error text-white rounded-full font-button text-button hover:opacity-90 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-lg right-lg bg-primary-container text-on-primary-container px-xl py-md rounded-full flex items-center gap-md shadow-xl z-50">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="font-button">{successMessage}</span>
        </div>
      )}

      <Footer />
      <BottomNav />

    </div>
  )
}

export default Profile