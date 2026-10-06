import React, { useState } from 'react'
import { Mail, Phone, MapPin, Copy, Check, Github, Linkedin, ArrowUp, FileText } from 'lucide-react'

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const email = 'namdeoshreyaslink@gmail.com'

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 py-12 sm:py-16 text-xs font-mono">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800">
          {/* Left Column: Direct Contact */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
                GET IN TOUCH
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs leading-relaxed max-w-md">
              Actively exploring AI/ML Engineer roles, on-device perception systems, and agentic LLM infrastructure. Let’s connect.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span className="text-zinc-800 dark:text-zinc-200">{email}</span>
                <button
                  onClick={copyEmail}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Phone className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>+91-9826411080</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Indore, Madhya Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Command & Quick Links */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-wider block mb-3">
                SYSTEM ACCESS
              </span>
              <div className="p-3 bg-zinc-900 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 text-zinc-100 rounded-lg flex items-center justify-between">
                <span className="text-zinc-300 font-mono text-[11px] truncate mr-2">
                  curl -sL https://github.com/23f2005639.keys
                </span>
                <span className="text-zinc-500 text-[10px]">SSH_AUTH</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/23f2005639"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/23f2005639</span>
              </a>
              <a
                href="https://www.linkedin.com/in/shreyas-namdeo-2119b0290/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>linkedin.com/in/shreyas-namdeo</span>
              </a>
              <a
                href="/shreyas_namdeo_resume.pdf"
                download="Shreyas_Namdeo_Resume.pdf"
                className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 dark:text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Shreyas Namdeo.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  )
}
