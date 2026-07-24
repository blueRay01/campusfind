import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from "../api/axios"

function LoginModal() {
    const { login, closeLoginModal } = useAuth()
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

    return(
        <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={closeLoginModal}
        >
            <div className="bg-surface-container-lowest p-xl rounded-xl w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-headline-md text-headline-md mb-lg text-center  ">Log in to continue</h3>

                <p className='text-center'>By continuing, you agree to our <a className="hover:underline text-blue-600" href='#'> 
                    User Agreement </a> and acknowledge that you understand the <a className="hover:underline text-blue-600" href='#' >
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
                    className='w-full h-12 px-lg rounded-full bg-surface-container-low border-none'/>

                    <input 
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('')}}
                    className="w-full h-12 px-lg rounded-full bg-surface-container-low border-none" />

                    {error && <p className='text-red-500 text-sm'>{error}</p>}

                    <button type='submit' className="w-full h-14 bg-primary-container text-on-primary rounded-full font-button text-button soft-shadow hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-sm mt-sm">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginModal