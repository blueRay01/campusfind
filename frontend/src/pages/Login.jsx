import React from "react"
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

function Login() {
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/login', {email, password})
            login(response.data.token)
            toast("Welcome back!")
            navigate('/feed')
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Try again.')
        }
        
    }

    const field = "w-full h-14 px-lg rounded-full border-2 border-ink/20 bg-surface-container-low font-body-lg text-body-lg text-ink placeholder:text-on-surface-variant/60 outline-none transition-all hover:border-ink/40 focus:border-ink focus:bg-surface-container-lowest focus:ring-4 focus:ring-lime/60"
    const label = "px-sm font-label-caps text-label-caps uppercase text-on-surface-variant"

    return (
        <AuthLayout>
            <div className="w-full max-w-[440px]">

                <div className="mb-xl">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink bg-lime">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>waving_hand</span>
                    </span>
                    <h1 className="mt-md font-display text-[clamp(34px,4vw,44px)] font-bold leading-tight tracking-[-0.03em] text-ink">Welcome Back</h1>
                    <p className="mt-xs font-body-lg text-body-lg text-on-surface-variant">Log in to post found items and claim what's yours.</p>
                </div>

                <form className="flex flex-col gap-lg" onSubmit={handleLogin}>
                    {/* Email */}
                    <div className="flex flex-col gap-xs">
                        <label htmlFor="email" className={label}>Email Address</label>
                        <input
                            id="email"
                            className={field}
                            placeholder="e.g. name@gmail.com"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value); setError('')}}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-xs">
                        <div className="flex items-center justify-between px-sm">
                            <label htmlFor="password" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Password</label>
                            <a className="font-label-caps text-label-caps uppercase text-ink hover:underline underline-offset-4" href="#">Forgot?</a>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                className={`${field} pr-[56px]`}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-ink"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="flex items-start gap-sm rounded-2xl border-2 border-error bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            {error}
                        </p>
                    )}

                    <button
                        className="mt-sm flex h-14 w-full items-center justify-center gap-sm rounded-full border-2 border-ink bg-lime font-button text-body-lg font-bold text-ink shadow-pop transition-all hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0 active:shadow-none"
                        type="submit"
                    >
                        Login
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </form>

                <div className="my-lg flex items-center gap-md">
                    <div className="h-0.5 flex-grow bg-ink/10"></div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">OR</span>
                    <div className="h-0.5 flex-grow bg-ink/10"></div>
                </div>

                <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                    Don't have an account yet?
                    <Link className="ml-xs font-bold text-ink underline-offset-4 hover:underline" to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}

export default Login
