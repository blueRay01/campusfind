import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"
import BottomNav from "../components/BottomNav"
import Footer from "../components/Footer"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
// Name can only be changed once every 30 days

const NAME_CHANGE_COOLDOWN_DAYS = 30

function getDaysUntilNextChange(lastChanged) {
  if (!lastChanged) return 0
  const diff = Date.now() - new Date(lastChanged).getTime()
  const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24))
  return Math.max(0, NAME_CHANGE_COOLDOWN_DAYS - daysPassed)
}

function formatDate(value, options) {
  if (!value) return ""
  const date = new Date(value)
  return isNaN(date) ? "" : date.toLocaleDateString(undefined, options)
}

function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const toast = useToast()
  const [user, setUser] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [nameError, setNameError] = useState("")
  const [messengerLink, setMessengerLink] = useState('')
  const [editingMessenger, setEditingMessenger] = useState(false)
  const [contactError, setContactError] = useState("")

  // Change password
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const fetchProfile = async() => {
      const response = await api.get('/auth/my') 
      setUser(response.data)
      setNewName(response.data.name)
    }
    fetchProfile()
  }, [])

  // Contact = phone number or Facebook/Messenger link (any text)
  const handleMessengerSave = async () => {
    try {
      const update = await api.patch('/auth/my', { messenger_link: messengerLink.trim() })
      setUser(prev => ({ ...prev, messenger_link: update.data.messenger_link }))
      setEditingMessenger(false)
      setContactError("")
      toast("Contact updated successfully.")
    } catch (err) {
      setContactError(err.response?.data?.message || "Couldn't update your contact. Try again.")
    }
  }

  const daysUntilChange = getDaysUntilNextChange(user.name_changed_at)
  const canChangeName = daysUntilChange === 0

  const handleNameSave = async () => {
    const trimmed = newName.trim()
    if (!trimmed) {
      setNameError("Name cannot be empty.")
      return
    }
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters.")
      return
    }
    if (trimmed === user.name) {
      setEditingName(false)
      return
    }
    if (!canChangeName) {
      setNameError(`You can change your name again in ${daysUntilChange} days.`)
      return
    }

    try {
      const response = await api.patch('/auth/my', { name: trimmed })
      setUser(prev => ({
        ...prev,
        name: response.data.name,
        name_changed_at: response.data.name_changed_at,
      }))
      setEditingName(false)
      setNameError("")
      toast("Display name updated.")
    } catch (err) {
      setNameError(err.response?.data?.message || "Couldn't update your name. Try again.")
    }
  }

  const closePasswordForm = () => {
    setPasswordOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.")
      return
    }

    try {
      const response = await api.patch('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword,
      })
      setUser(prev => ({ ...prev, password_changed_at: response.data.password_changed_at }))
      closePasswordForm()
      toast("Password updated.")
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Couldn't update your password. Try again.")
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    try {
      await api.delete('/auth/my', { data: { password: deletePassword } })
      logout()
      navigate("/feed")
      toast("Your account has been deleted.", "info") 
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Couldn't delete your account. Try again.")
    }
  }

  const card = "rounded-[28px] border-2 border-ink bg-surface-container-lowest p-lg sm:p-xl"
  const smallBtn = "h-10 shrink-0 rounded-full border-2 border-ink px-md font-button text-button transition-colors"
  const fieldInput = "w-full h-12 rounded-full border-2 border-ink/20 bg-surface-container-low px-lg font-body-lg text-body-lg text-ink outline-none transition-all focus:border-ink focus:bg-surface-container-lowest focus:ring-4 focus:ring-lime/60"
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
        <SideBar />

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
                  {user.created_at && (
                    <span className="rounded-full border-2 border-ink/20 px-3 py-0.5 font-label-caps text-label-caps uppercase text-on-surface-variant">
                      Joined {formatDate(user.created_at, { month: "short", year: "numeric" })}
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
                    <span className="material-symbols-outlined text-[20px] text-ink">contact_phone</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">Contact</p>

                    {editingMessenger ? (
                      <div className="mt-xs flex flex-wrap gap-sm">
                        <input
                          type="text"
                          value={messengerLink}
                          placeholder="Phone number or Facebook link"
                          aria-label="Contact"
                          onChange={(e) => { setMessengerLink(e.target.value); setContactError("") }}
                          className={inlineInput}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleMessengerSave}
                          className={`${smallBtn} bg-lime`}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMessengerLink(user.messenger_link || "")
                            setEditingMessenger(false)
                            setContactError("")
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
                            { setMessengerLink(user.messenger_link || "")
                              setEditingMessenger(true)}}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-ink"
                          title="Edit contact"
                          aria-label="Edit contact"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    )}
                    {contactError && (
                      <p role="alert" className="mt-xs font-body-sm text-body-sm text-error">{contactError}</p>
                    )}
                    <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant/80">
                      Phone number or Facebook link, so finders and owners can reach you.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Password */}
            <section className={`${card} mb-lg`}>
              <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-headline-md text-headline-md text-ink">Password</h3>
                  <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
                    Last changed: {user.password_changed_at ? formatDate(user.password_changed_at, { month: "short", day: "numeric", year: "numeric" }) : "Never"}
                  </p>
                </div>
                {!passwordOpen && (
                  <button type="button" onClick={() => setPasswordOpen(true)} className={`${smallBtn} self-start hover:bg-violet-soft sm:self-auto`}>
                    Change Password
                  </button>
                )}
              </div>

              {passwordOpen && (
                <form onSubmit={handlePasswordSave} className="mt-lg flex flex-col gap-md border-t-2 border-ink/10 pt-lg">
                  <input
                    type="password"
                    placeholder="Current password"
                    aria-label="Current password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError("") }}
                    className={fieldInput}
                    required
                  />
                  <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                    <input
                      type="password"
                      placeholder="New password (8+ characters)"
                      aria-label="New password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordError("") }}
                      className={fieldInput}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      aria-label="Confirm new password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError("") }}
                      className={fieldInput}
                      required
                    />
                  </div>
                  {passwordError && (
                    <p role="alert" className="font-body-sm text-body-sm text-error">{passwordError}</p>
                  )}
                  <div className="flex flex-wrap gap-sm">
                    <button type="submit" className={`${smallBtn} bg-lime`}>Update Password</button>
                    <button type="button" onClick={closePasswordForm} className={`${smallBtn} hover:bg-surface-container`}>Cancel</button>
                  </div>
                </form>
              )}
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
                  onClick={() => { logout(); navigate("/feed"); toast("Logged out.", "info") }}
                  className={`${smallBtn} bg-surface-container-lowest hover:bg-surface-container-low`}
                >
                  Log Out
                </button>
                {!deleteOpen && (
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className={`${smallBtn} border-error bg-error text-on-error hover:opacity-90`}
                  >
                    Delete Account
                  </button>
                )}
              </div>

              {deleteOpen && (
                <form onSubmit={handleDeleteAccount} className="mt-lg flex flex-col gap-md border-t-2 border-error/20 pt-lg">
                  <p className="font-body-sm text-body-sm text-on-error-container">
                    This deletes your account, your posts, and your claims. Enter your password to confirm.
                  </p>
                  <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password to confirm deletion"
                    autoComplete="current-password"
                    value={deletePassword}
                    onChange={(e) => { setDeletePassword(e.target.value); setDeleteError("") }}
                    className={fieldInput}
                    required
                  />
                  {deleteError && (
                    <p role="alert" className="font-body-sm text-body-sm text-error">{deleteError}</p>
                  )}
                  <div className="flex flex-wrap gap-sm">
                    <button type="submit" className={`${smallBtn} border-error bg-error text-on-error hover:opacity-90`}>
                      Permanently Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => { setDeleteOpen(false); setDeletePassword(""); setDeleteError("") }}
                      className={`${smallBtn} bg-surface-container-lowest hover:bg-surface-container-low`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

          </div>
        </main>
      </div>

      <Footer />
      <BottomNav />

    </div>
  )
}

export default Profile