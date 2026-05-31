import React from 'react';
import { Link } from 'react-router-dom';
import useState from 'react';


function Register() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="min-h-screen flex flex-col">
    {/* <!-- Main Content --> */}
    <main className="flex-grow flex items-center justify-center py-xxl px-margin-mobile">
    <div className="w-full max-w-[540px]">
    <div className="hidden lg:flex items-center justify-end flex-1">
    <img
        src="/illustrations/search.svg"
        alt="Search illustration"
        className="w-full max-w-[280px]"
    />
    </div>
    {/* <!-- Registration Card --> */}
    <div className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl soft-shadow w-full max-w-[540px]">
    <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
    {/* <!-- First Name --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">First Name</label>
    <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant" placeholder="John" type="text"/>
    </div>
    {/* Course */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-on-surface-variant px-sm">Course</label>
    <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline/50" placeholder="e.g. BSCS" type="text"/>
    </div>
    </div>
    {/* <!-- Student ID No. --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Student ID No.</label>
    <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant" placeholder="STU-2024-001" type="text"/>
    </div>
    {/* <!-- Email Address --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Email Address</label>
    <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant" placeholder="john.doe@university.edu" type="email"/>
    </div>
    {/* <!-- Password --> */}           
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Password</label>
    <div className="relative">
    <input className="w-full h-14 px-lg rounded-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container transition-all font-body-lg text-body-lg text-on-surface placeholder:text-outline-variant" placeholder="••••••••" type="password"/>
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
    {/* <!-- CTA --> */}
    <div className="pt-md">
    <button className="w-full bg-primary text-on-primary font-button text-button py-md rounded-full shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all">
                                Create Account
                            </button>
    </div>
    </form>
    <div className="mt-xl flex items-center gap-md">
    <div className="h-[1px] flex-grow bg-outline-variant"></div>
    <span className="font-label-caps text-label-caps text-outline-variant">OR</span>
    <div className="h-[1px] flex-grow bg-outline-variant"></div>
    </div>
    <div className="mt-lg text-center">
    <p className="font-body-sm text-body-sm text-secondary">
    Already have an account?
    <Link className="text-primary font-bold hover:underline" to="/"> Sign In</Link>
    </p>
    </div>
    </div>
    </div>
    </main>
    {/* <!-- Footer --> */}
    <footer className="w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant mt-bento-gap">
    <div className="flex flex-col md:items-start items-center">
    <span className="font-headline-lg text-headline-lg-mobile text-primary">CampusFind</span>
    <p className="font-body-sm text-body-sm text-secondary dark:text-secondary-fixed">© 2024 CampusFind. Institutional Item Network.</p>
    </div>
    <div className="flex gap-lg">
    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Support</a>
    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Legal</a>
    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Privacy</a>
    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-opacity opacity-80 hover:opacity-100" href="#">Contact</a>
    </div>
    </footer>
    </div>
    )
    
}

export default Register