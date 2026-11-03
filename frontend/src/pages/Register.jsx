import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';


function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [course, setCourse] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            await api.post('/auth/register', {name, student_id: studentId, email, password, course});
            setSuccess(true)
            setTimeout(() => navigate('/'), 2000)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong. Try again.")
        }
    }
    const field = "w-full h-14 px-lg rounded-full border-2 border-ink/20 bg-surface-container-low font-body-lg text-body-lg text-ink placeholder:text-on-surface-variant/60 outline-none transition-all hover:border-ink/40 focus:border-ink focus:bg-surface-container-lowest focus:ring-4 focus:ring-lime/60"
    const label = "block mb-xs px-sm font-label-caps text-label-caps uppercase text-on-surface-variant"

    return (
    <AuthLayout>
        <div className="w-full max-w-[480px]">

            <div className="mb-xl">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink bg-violet">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                </span>
                <h1 className="mt-md font-display text-[clamp(34px,4vw,44px)] font-bold leading-tight tracking-[-0.03em] text-ink">Create your account</h1>
                <p className="mt-xs font-body-lg text-body-lg text-on-surface-variant">Post what you find and claim what you lost.</p>
            </div>

            <form className="flex flex-col gap-lg" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
                    {/* First Name */}
                    <div>
                        <label htmlFor="name" className={label}>First Name</label>
                        <input id="name" className={field} placeholder="John" type="text" autoComplete="given-name" value={name} onChange={(e) => {setName(e.target.value)}}/>
                    </div>
                    {/* Course */}
                    <div>
                        <label htmlFor="course" className={label}>Course</label>
                        <input id="course" className={field} placeholder="e.g. BSCS" type="text" value={course} onChange={(e) => setCourse(e.target.value)}/>
                    </div>
                </div>

                {/* Student ID No. */}
                <div>
                    <label htmlFor="studentId" className={label}>Student ID No.</label>
                    <input id="studentId" className={field} placeholder="STU-2024-001" type="text" value={studentId} onChange={(e) => {setStudentId(e.target.value)}}/>
                </div>

                {/* Email Address */}
                <div>
                    <label htmlFor="email" className={label}>Email Address</label>
                    <input id="email" className={field} placeholder="john.doe@university.edu" type="email" autoComplete="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className={label}>Password</label>
                    <div className="relative">
                        <input id="password" className={`${field} pr-[56px]`} placeholder="••••••••" autoComplete="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => {setPassword(e.target.value)}}/>
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

                {success && (
                    <p role="status" className="flex items-center gap-sm rounded-2xl border-2 border-ink bg-lime-soft px-md py-sm font-body-sm text-body-sm text-ink">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Account created! Redirecting to login...
                    </p>
                )}
                {error && (
                    <p role="alert" className="flex items-start gap-sm rounded-2xl border-2 border-error bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        {error}
                    </p>
                )}

                <button className="mt-sm flex h-14 w-full items-center justify-center gap-sm rounded-full border-2 border-ink bg-lime font-button text-body-lg font-bold text-ink shadow-pop transition-all hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0 active:shadow-none">
                    Create Account
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
            </form>

            <div className="my-lg flex items-center gap-md">
                <div className="h-0.5 flex-grow bg-ink/10"></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">OR</span>
                <div className="h-0.5 flex-grow bg-ink/10"></div>
            </div>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                Already have an account?
                <Link className="ml-xs font-bold text-ink underline-offset-4 hover:underline" to="/"> Sign In</Link>
            </p>
        </div>
    </AuthLayout>
    )

}

export default Register
