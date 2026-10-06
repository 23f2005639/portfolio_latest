import React, { useState } from 'react'
import { Github, Linkedin, Download, Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors border-b border-transparent dark:border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Empty space for mobile alignment */}
        <div className="md:hidden" />

        {/* Right CTA Links */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 transition-transform hover:rotate-12" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>

          <a
            href="https://github.com/23f2005639"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/shreyas-namdeo-2119b0290/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="/shreyas_namdeo_resume.pdf"
            download="Shreyas_Namdeo_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all font-medium text-xs shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Resume PDF</span>
          </a>
        </div>

        {/* Mobile Menu & Theme Buttons */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <a
            href="/shreyas_namdeo_resume.pdf"
            download="Shreyas_Namdeo_Resume.pdf"
            className="p-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-4 space-y-3 font-mono text-xs border-b border-zinc-100 dark:border-zinc-800">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
            <a
              href="https://github.com/23f2005639"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shreyas-namdeo-2119b0290/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
