function Footer() {
  const links = ["Support", "Legal", "Privacy", "Contact"]

  return (
    <footer className="w-full py-8 px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low border-t border-outline-variant mt-xxl relative z-10">
      <div className="flex flex-col items-center md:items-start">
        <span className="font-headline-lg text-headline-lg-mobile text-primary">CampusFind</span>
        <p className="font-body-sm text-body-sm text-secondary">© 2024 CampusFind. Institutional Item Network.</p>
      </div>
      <div className="flex gap-6">
        {links.map(link => (
          <a key={link} href="#" className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-opacity opacity-80 hover:opacity-100">
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}

export default Footer