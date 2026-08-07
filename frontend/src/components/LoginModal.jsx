import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from "../api/axios"

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
            const response = await api.post('/auth/register', {userName, email, password})
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Try again')
        }
    }

    return(
        
        <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={closeAuthModal}
        >
            {authMode === 'login' ? (
                <div className="bg-surface-container-lowest p-xl w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-headline-md text-headline-md mb-lg text-center">Log In</h3>

                <p className='text-center'>By continuing, you agree to our <a className="hover:underline text-black font-bold" href='#'> 
                    User Agreement </a> and acknowledge that you understand the <a className="hover:underline text-black font-bold" href='#' >
                     Privacy Policy
                    </a>
                    .
                    </p>

                <form className='mt-lg flex flex-col gap-md' onSubmit={handleLogin}> 
                    <input 
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setError('')}}
                    className='w-full h-12 px-lg bg-surface-container-low border-none'/>

                    <input 
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('')}}
                    className="w-full h-12 px-lg bg-surface-container-low border-none" />

                    {error && <p className='text-red-500 text-sm'>{error}</p>}

                    <button type='submit' className="w-full h-14 bg-black text-white font-button text-button soft-shadow hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-sm mt-sm">Login</button>

                    <div className='flex items-center gap-2 justify-center'>
                        <p className=''>Don't have an account yet?</p>
                        <button type='button' onClick={() => {openAuthModal('register')}} className='text-black font-bold hover:underline'>Sign Up</button>
                    </div>
                    
                </form>
            </div>
            ) : (
                <div className="bg-surface-container-lowest p-xl w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-headline-md text-headline-md mb-lg text-center">Sign Up</h3>

                <p className='text-center'>By continuing, you agree to our <a className="hover:underline text-black font-bold" href='#'> 
                    User Agreement </a> and acknowledge that you understand the <a className="hover:underline text-black font-bold" href='#' >
                     Privacy Policy
                    </a>
                    .
                    </p>

                <form className='mt-lg flex flex-col gap-md' onSubmit={handleRegister}> 
                    <input 
                    type='text'
                    placeholder='Name'
                    value={userName}
                    onChange={(e) => {
                        setUserName(e.target.value);
                        setError('')
                    }}
                    className='w-full h-12 px-lg bg-surface-container-low border-none'
                    />

                    <input 
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setError('')}}
                    className='w-full h-12 px-lg bg-surface-container-low border-none'/>

                    <input 
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setError('')}}
                    className="w-full h-12 px-lg bg-surface-container-low border-none" />

                    {error && <p className='text-red-500 text-sm'>{error}</p>}

                    <button type='submit' className="w-full h-14 bg-black text-on-primary font-button text-button soft-shadow hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-sm mt-sm">Sign Up</button>

                    <div className='flex items-center gap-2 justify-center'>
                        <p>Already have an account?</p>
                        <button type='button' onClick={() => {openAuthModal('login')}} className='text-black font-bold hover:underline'>Log In</button>
                    </div>
                </form>
            </div>
            )}
            
            
        </div>
    )
}

export default LoginModal