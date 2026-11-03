import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from "../api/axios"

const cardClass =
    "relative w-full max-w-[420px] max-h-[calc(100vh-32px)] overflow-y-auto bg-surface-container-lowest border-2 border-ink rounded-[28px] shadow-pop-lg p-lg sm:p-xl"
const inputClass =
    "pill-input w-full h-12 px-lg rounded-full bg-surface-container-low border-2 border-transparent font-body-lg text-body-lg placeholder:text-on-surface-variant"
const submitClass =
    "w-full h-14 mt-sm rounded-full bg-lime text-ink border-2 border-ink shadow-pop-sm font-button text-button flex items-center justify-center gap-sm transition-all hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0 active:shadow-none"
const linkClass = "text-ink font-bold underline-offset-4 hover:underline"

function LoginModal() {
    const { login, authMode, openAuthModal, closeAuthModal } = useAuth()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/login', { email, password})
            login(response.data.token)
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Try again')
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/auth/register', { name: userName, email, password})
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Try again')
        }
    }

    const isLogin = authMode === 'login'

    const errorMessage = error && (
        <p role="alert" className="flex items-center gap-xs font-body-sm text-body-sm text-error">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
        </p>
    )

    const terms = (
        <p className="mt-lg text-center font-body-sm text-body-sm text-on-surface-variant">
            By continuing, you agree to our <a className={linkClass} href="#">User Agreement</a> and
            acknowledge that you understand the <a className={linkClass} href="#">Privacy Policy</a>.
        </p>
    )

    return(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-md"
            onClick={closeAuthModal}
        >
            <div
                className={cardClass}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <span className={`grid place-items-center w-12 h-12 rounded-2xl border-2 border-ink ${isLogin ? "bg-lime" : "bg-violet"}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isLogin ? "location_on" : "person_add"}
                    </span>
                </span>

                {isLogin ? (
                    <>
                        <h3 id="auth-title" className="mt-md font-display text-[32px] font-bold leading-tight tracking-tight">Welcome back</h3>
                        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Log in to post items and claim what's yours.</p>

                        <form className="mt-lg flex flex-col gap-md" onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email"
                                aria-label="Email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value); setError('')}}
                                className={inputClass} />

                            <input
                                type="password"
                                placeholder="Password"
                                aria-label="Password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError('')}}
                                className={inputClass} />

                            {errorMessage}

                            <button type="submit" className={submitClass}>Log In</button>

                            <div className="flex flex-wrap items-center justify-center gap-2 font-body-sm text-body-sm">
                                <p className="text-on-surface-variant">Don't have an account yet?</p>
                                <button type="button" onClick={() => {openAuthModal('register')}} className={linkClass}>Sign Up</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 id="auth-title" className="mt-md font-display text-[32px] font-bold leading-tight tracking-tight">Join CampusFind</h3>
                        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Post what you find and claim what you lost.</p>

                        <form className="mt-lg flex flex-col gap-md" onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="Name"
                                aria-label="Name"
                                autoComplete="name"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    setError('')
                                }}
                                className={inputClass} />

                            <input
                                type="email"
                                placeholder="Email"
                                aria-label="Email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value); setError('')}}
                                className={inputClass} />

                            <input
                                type="password"
                                placeholder="Password"
                                aria-label="Password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value); setError('')}}
                                className={inputClass} />

                            {errorMessage}

                            <button type="submit" className={submitClass}>Sign Up</button>

                            <div className="flex flex-wrap items-center justify-center gap-2 font-body-sm text-body-sm">
                                <p className="text-on-surface-variant">Already have an account?</p>
                                <button type="button" onClick={() => {openAuthModal('login')}} className={linkClass}>Log In</button>
                            </div>
                        </form>
                    </>
                )}

                {terms}
            </div>
        </div>
    )
}

export default LoginModal
