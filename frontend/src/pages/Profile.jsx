import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
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

  const card = "rounded-[28px] border-2 border-ink bg-surface-container-lowest p-lg sm:p-xl"
  const smallBtn = "h-10 shrink-0 rounded-full border-2 border-ink px-md font-button text-button transition-colors"
  const inlineInput = "min-w-0 flex-1 basis-full sm:basis-0 h-10 rounded-full border-2 border-ink/20 bg-surface-container-low px-md font-body-lg text-body-lg text-ink outline-none transition-all focus:border-ink focus:bg-surface-container-lowest focus:ring-4 focus:ring-lime/60"

  const detailRows = [
    { label: "Student ID", value: user.student_id, icon: "badge", note: "Cannot be changed." },
    { label: "Email Address", value: user.email, icon: "mail", note: "Contact support to change your email." },
    { label: "Course", value: user.course, icon: "school", note: "Contact your registrar to update." },
  ]

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-on-surface">

      <Navbar />

      <div className="flex flex-1">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 min-w-0 px-margin-mobile md:px-8 lg:px-12 pt-xl lg:pt-xxl">
          <div className="max-w-[900px]">

            {/* Page header */}
            <div className="mb-xl">
              <h1 className="font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1] tracking-[-0.03em] text-ink">My Profile</h1>
              <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">Manage your account information.</p>
            </div>

            {/* Avatar and name */}
            <section className={`${card} mb-lg flex flex-col items-center gap-lg overflow-hidden sm:flex-row sm:items-center relative`}>
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-soft" aria-hidden="true" />

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="grid h-24 w-24 select-none place-items-center rounded-full border-2 border-ink bg-lime font-display text-4xl font-bold text-ink">
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <button
                  type="button"
                  aria-label="Change avatar"
                  className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-violet transition-transform hover:scale-110"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              {/* Name and basic info */}
              <div className="relative w-full flex-1 text-center sm:text-left">
                {editingName ? (
                  <div className="flex w-full flex-col gap-xs">
                    <div className="flex flex-wrap gap-sm">
                      <input
                        type="text"
                        value={newName}
                        aria-label="Display name"
                        onChange={(e) => { setNewName(e.target.value); setNameError("") }}
                        className={inlineInput}
                        autoFocus
                      />
                      <button type="button" onClick={handleNameSave} className={`${smallBtn} bg-lime`}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingName(false); setNewName(user.name); setNameError("") }}
                        className={`${smallBtn} hover:bg-surface-container`}
                      >
                        Cancel
                      </button>
                    </div>
                    {nameError && (
                      <p className="px-sm font-body-sm text-body-sm text-error">{nameError}</p>
                    )}
                    {!canChangeName && (
                      <p className="px-sm font-body-sm text-body-sm text-on-surface-variant">
                        You can change your name again in {daysUntilChange} days.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-sm sm:justify-start">
                    <h2 className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-tight text-ink">{user.name}</h2>
                    <button
                      type="button"
                      onClick={() => setEditingName(true)}
                      className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-ink"
                      title={canChangeName ? "Edit name" : `Name change available in ${daysUntilChange} days`}
                      aria-label="Edit name"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                )}

                <div className="mt-sm flex flex-wrap justify-center gap-sm sm:justify-start">
                  {user.course && (
                    <span className="rounded-full border-2 border-ink bg-violet px-3 py-0.5 font-label-caps text-label-caps uppercase">
                      {user.course}
                    </span>
                  )}
                  {user.joinedDate && (
                    <span className="rounded-full border-2 border-ink/20 px-3 py-0.5 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Joined {user.joinedDate}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Account details */}
            <section className={`${card} mb-lg`}>
              <h3 className="mb-lg font-headline-md text-headline-md text-ink">Account Details</h3>
              <div className="flex flex-col gap-sm">

                {detailRows.map(field => (
                  <div key={field.label} className="flex items-start gap-md rounded-2xl bg-surface-container-low p-md">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface-container-lowest">
                      <span className="material-symbols-outlined text-[20px] text-ink">{field.icon}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">{field.label}</p>
                      <p className="mt-0.5 break-words font-body-lg text-body-lg text-ink">{field.value || "Not set"}</p>
                      <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant/80">{field.note}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-md rounded-2xl bg-surface-container-low p-md">
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border-2 border-ink bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-[20px] text-ink">link</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">Facebook Link</p>

                    {editingMessenger ? (
                      <div className="mt-xs flex flex-wrap gap-sm">
                        <input
                          type="text"
                          value={messengerLink}
                          aria-label="Facebook link"
                          onChange={(e) => setMessengerLink(e.target.value)}
                          className={inlineInput}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await handleMessengerSave()
                            setEditingMessenger(false)
                            triggerSuccess("Facebook link updated successfully.")
                          }}
                          className={`${smallBtn} bg-lime`}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMessengerLink(user.messenger_link)
                            setEditingMessenger(false)
                          }}
                          className={`${smallBtn} hover:bg-surface-container`}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-sm">
                        <p className="min-w-0 truncate font-body-lg text-body-lg text-ink">{user.messenger_link || "Not set"}</p>
                        <button
                          type="button"
                          onClick={() =>
                            { setMessengerLink(user.messenger_link)
                              setEditingMessenger(true)}}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-ink"
                          title="Edit Facebook link"
                          aria-label="Edit Facebook link"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    )}
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant/80">So finders and owners can message you.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Password */}
            <section className={`${card} mb-lg flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between`}>
              <div>
                <h3 className="font-headline-md text-headline-md text-ink">Password</h3>
                <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Last changed: Never</p>
              </div>
              <button type="button" className={`${smallBtn} self-start hover:bg-violet-soft sm:self-auto`}>
                Change Password
              </button>
            </section>

            {/* Danger zone */}
            <section className="rounded-[28px] border-2 border-error bg-error-container p-lg sm:p-xl">
              <h3 className="flex items-center gap-sm font-headline-md text-headline-md text-error">
                <span className="material-symbols-outlined">warning</span>
                Danger Zone
              </h3>
              <p className="mt-xs mb-lg font-body-sm text-body-sm text-on-error-container">These actions are permanent and cannot be undone.</p>
              <div className="flex flex-col gap-sm sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`${smallBtn} bg-surface-container-lowest hover:bg-surface-container-low`}
                >
                  Log Out
                </button>
                <button type="button" className={`${smallBtn} border-error bg-error text-on-error hover:opacity-90`}>
                  Delete Account
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* Success toast (sits above the bottom nav and + button on phones) */}
      {showSuccess && (
        <div
          role="status"
          className="fixed left-1/2 z-[55] flex -translate-x-1/2 items-center gap-sm whitespace-nowrap rounded-full border-2 border-ink bg-lime px-lg py-sm text-ink shadow-pop bottom-[calc(160px+env(safe-area-inset-bottom))] lg:left-auto lg:right-lg lg:bottom-lg lg:translate-x-0"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="font-button text-button">{successMessage}</span>
        </div>
      )}

      <Footer />
      <BottomNav />

    </div>
  )
}

export default Profile