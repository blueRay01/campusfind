import React from "react"

function Login() {
    return (
        <div className="bg-background text-on-surface selection:bg-primary-fixed-dim min-h-screen flex flex-col">
        {/* <!-- TopNavBar (Shell Suppression: Hidden because Login is Transactional/Focused) -->
        <!-- Per instructions: Suppress navigation shell for Login/Sign-up/Transactional screens --> */}
        <main classNameName="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl">
        <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-xxl items-center">
        {/* <!-- Hero Side (Desktop Only) --> */}
        <div className="hidden lg:flex flex-col gap-lg">
        <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1"}} >find_in_page</span>
        <h1 className="font-headline-lg text-headline-lg text-primary">CampusFind</h1>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
        Recover your lost <br/>
        <span className="text-on-primary-container">valuables with ease.</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
        The official campus lost and found network. Helping students and faculty reconnect with their belongings through a modern, secure, and approachable platform.
        </p>
        <div className="mt-md rounded-xl overflow-hidden soft-shadow bg-surface-container-lowest border border-outline-variant p-sm">
        <img alt="Campus Life" className="w-full h-64 object-cover rounded-lg" data-alt="A bright and airy university library setting featuring students collaborating around a clean wooden table. The aesthetic is minimalist and modern, with soft natural light flooding the space. The color palette consists of neutral whites, light wood tones, and subtle navy blue accents, reflecting a calm and productive academic environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAENAGGZNuzlcD3KAuEDJOLZCcIvew9nQzpWV7-lc2dgV-IFUJ9kxA8BYKJ9HWgVNOWUsZ_1bfbSNh9vdz4q7taVNrDL3b_4Z1u4wJtSeXHLAiPy7fylpfpVrf8v4YYRdCoCcrYfJXbQDag0Aah54xrOaQ1wSCJuRFPtK5KV6PIvIC4VegiQ-LMTa2PQs0AI3x519uTQAZfUt7WT2W2EJdzWM5Oh-dNZkcfsLJ_EK-xtIyf7Q4DyBrsvanzLIjt1cIDC3ZlvTa-NK4"/>
        </div>
        </div>
        {/* <!-- Login Form Container --> */}
        <div className="flex justify-center lg:justify-end">
        <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl soft-shadow w-full max-w-[440px] transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center mb-xl lg:hidden">
        <span className="material-symbols-outlined text-primary text-4xl mb-sm" style= {{ fontVariationSettings: "'FILL' 1"}}>find_in_page</span>
        <h1 className="font-headline-lg text-headline-lg text-primary">CampusFind</h1>
        </div>
        <div className="mb-xl">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Welcome Back</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Access the institutional item network</p>
        </div>
        <form className="flex flex-col gap-lg">
        {/* <!-- Email Field --> */}
        <div className="flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant px-sm">Email Address</label>
        <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline/50" placeholder="e.g. name@gmail.com" type="email"/>
        </div>
        {/* <!-- Password Field --> */}
        <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-center px-sm">
        <label className="font-label-caps text-label-caps text-on-surface-variant">Password</label>
        <a className="font-label-caps text-label-caps text-on-primary-container hover:underline" href="#">Forgot?</a>
        </div>
        <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline/50" placeholder="••••••••" type="password"/>
        </div>
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
        <a className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-xs" href="#">Register</a>
        </p>
        </div>
        </div>
        </div>
        </div>
        </main>
        {/* <!-- Footer (Using Shared Component JSON mapping) --> */}
        <footer className="w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant mt-bento-gap bg-surface-container-low dark:bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-xs">
        <span className="font-headline-lg text-headline-lg-mobile text-primary">CampusFind</span>
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