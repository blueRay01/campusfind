import React from 'react';


function Register() {
    return (
        <div className="min-h-screen flex flex-col">
    {/* <!-- Top Navigation Bar --> */}
    <nav className="bg-surface dark:bg-inverse-surface flex justify-between items-center w-full px-margin-desktop h-16 border-b border-outline-variant dark:border-outline flat no shadows">
    <div className="flex items-center gap-8">
    <span className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary">CampusFind</span>
    </div>
    <div className="flex items-center gap-md">
    <button className="material-symbols-outlined text-primary dark:text-inverse-primary hover:bg-surface-container-high transition-colors duration-200 p-2 rounded-full" data-icon="notifications">notifications</button>
    <button className="material-symbols-outlined text-primary dark:text-inverse-primary hover:bg-surface-container-high transition-colors duration-200 p-2 rounded-full" data-icon="account_circle">account_circle</button>
    </div>
    </nav>
    {/* <!-- Main Content --> */}
    <main className="flex-grow flex items-center justify-center py-xxl px-margin-mobile">
    <div className="w-full max-w-[540px]">
    {/* <!-- Header Section --> */}
    <div className="text-center mb-xl">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-fixed rounded-xl mb-md">
    <span className="material-symbols-outlined text-[32px] text-primary" data-icon="person_add">person_add</span>
    </div>
    <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Registration (Desktop)</h1>
    <p className="font-body-lg text-body-lg text-secondary">Join the institutional item network today.</p>
    </div>
    {/* <!-- Registration Card --> */}
    <div className="form-card rounded-xl p-xl">
    <form action="#" className="space-y-lg" method="POST" onsubmit="event.preventDefault()">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
    {/* <!-- First Name --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">First Name</label>
    <input className="pill-input w-full px-md py-md bg-surface-container-low border-0 rounded-full font-body-lg text-body-lg placeholder:text-outline-variant" placeholder="John" type="text"/>
    </div>
    {/* <!-- Age --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Age</label>
    <input className="pill-input w-full px-md py-md bg-surface-container-low border-0 rounded-full font-body-lg text-body-lg placeholder:text-outline-variant" placeholder="21" type="number"/>
    </div>
    </div>
    {/* <!-- Student ID No. --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Student ID No.</label>
    <input className="pill-input w-full px-md py-md bg-surface-container-low border-0 rounded-full font-body-lg text-body-lg placeholder:text-outline-variant" placeholder="STU-2024-001" type="text"/>
    </div>
    {/* <!-- Email Address --> */}
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Email Address</label>
    <input className="pill-input w-full px-md py-md bg-surface-container-low border-0 rounded-full font-body-lg text-body-lg placeholder:text-outline-variant" placeholder="john.doe@university.edu" type="email"/>
    </div>
    {/* <!-- Password --> */}           
    <div className="space-y-xs">
    <label className="font-label-caps text-label-caps text-secondary px-sm">Password</label>
    <div className="relative">
    <input className="pill-input w-full px-md py-md bg-surface-container-low border-0 rounded-full font-body-lg text-body-lg placeholder:text-outline-variant" placeholder="••••••••" type="password"/>
    <button className="absolute right-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline" data-icon="visibility" type="button">visibility</button>
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
                            <a className="text-primary font-bold hover:underline" href="#">Sign In</a>
    </p>
    </div>
    </div>
    {/* <!-- Visual Decorative Element --> */}
    <div className="mt-xl flex justify-center gap-gutter opacity-40">
    <div className="w-12 h-12 bg-secondary-container rounded-lg"></div>
    <div className="w-12 h-12 bg-primary-fixed rounded-full"></div>
    <div className="w-12 h-12 bg-tertiary-fixed rounded-lg"></div>
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