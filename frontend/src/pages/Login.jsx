import React from "react"
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

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
            navigate('/feed')
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Try again.')
        }
        
    }

    return (
        <div className="bg-background text-on-surface selection:bg-primary-fixed-dim min-h-screen flex flex-col">
        {/* <!-- TopNavbar (Shell Suppression: Hidden because Login is Transactional/Focused) -->
        <!-- Per instructions: Suppress navigation shell for Login/Sign-up/Transactional screens --> */}
        <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl">
        <div className="max-w-[1100px] w-full flex items-center justify-center gap-xxl">
            {/* Left illustration */}
            <div className="hidden lg:flex items-center justify-end flex-1">
            <img
                src="/illustrations/search.svg"
                alt="Search illustration"
                className="w-full max-w-[280px]"
            />
            </div>
            {/* <!-- Login Form Container --> */}
            <div className="flex justify-center">
            <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl soft-shadow w-full max-w-[440px] transition-all duration-300">
            
        <div className="mb-xl text-center">
            <div className="flex items-center justify-center gap-sm mb-md">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>find_in_page</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Welcome Back</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Access the institutional item network</p>
        </div>
        <form className="flex flex-col gap-lg" onSubmit={handleLogin}>
        {/* <!-- Email Field --> */}
        <div className="flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant px-sm">Email Address</label>
        <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline/50" placeholder="e.g. name@gmail.com" type="email" value={email} onChange={(e) => {setEmail(e.target.value); setError('')}}/>
        </div>
        {/* <!-- Password Field --> */}
        <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center px-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant">Password</label>
                <a className="font-label-caps text-label-caps text-on-primary-container hover:underline" href="#">Forgot?</a>
            </div>
            <div className="relative">
                <input
                    className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline/50 pr-[56px]"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                    </span>
                </button>
            </div>
        </div>
         {error && <p className="text-red-500 text-sm">{error}</p>}
        {/* <!-- Login Button --> */}
        <button className="w-full h-14 bg-primary-container text-on-primary rounded-full font-button text-button soft-shadow hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-sm mt-sm" type="submit">
        Login
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div className="relative flex items-center py-sm">
        <div className="flex-grow border-t border-outline-variant"></div>
        <span className="flex-shrink mx-md font-label-caps text-label-caps text-outline/60">OR</span>
        <div className="flex-grow border-t border-outline-variant"></div>
        </div>
        </form>
        <div className="mt-xl text-center">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
        Don't have an account yet?
        <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-xs" to="/register">
          Register
        </Link>
        </p>
        </div>
        </div>
        </div>
        {/* Right illustration */}
        <div className="hidden lg:flex items-center justify-start flex-1">
        <img
            src="/illustrations/found.svg"
            alt="Found illustration"
            className="w-full max-w-[280px]"
        />
        </div>
        </div>
        </main>

        {/* <!-- Footer (Using Shared Component JSON mapping) --> */}
        <footer className="w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant mt-bento-gap bg-surface-container-low dark:bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-xs">
        <h1 className="font-syne font-headline-lg text-headline-lg text-primary">
        CampusFind
        </h1>
        <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed">© 2024 CampusFind. Institutional Item Network.</p>
        </div>
        <div className="flex gap-lg">
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">Support</a>
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">Legal</a>
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">Privacy</a>
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="#">Contact</a>
        </div>
        </footer>
        </div>
    )
}

export default Login