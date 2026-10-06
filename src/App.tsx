import React from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ThreeAsciiHero } from '@/components/ascii/ThreeAsciiHero'
import { AsciiMatrixText } from '@/components/ascii/AsciiMatrixText'
import { ProjectsSection } from '@/components/projects/ProjectsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { SkillsMatrix } from '@/components/sections/SkillsMatrix'
import { Linkedin, Download, ArrowDown } from 'lucide-react'

export function AppContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 dark:selection:bg-white selection:text-white dark:selection:text-zinc-900 transition-colors duration-200">
      {/* Top Header / Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HERO SECTION */}
        <section className="pt-4 sm:pt-8 pb-10 sm:pb-14 border-b border-zinc-100 dark:border-zinc-800/80">
          {/* Three.js AsciiEffect Hero Banner with Precious Floating Head Mascot */}
          <div className="mb-6">
            <ThreeAsciiHero />
          </div>

          {/* Bio & Intro Summary */}
          <div className="max-w-2xl space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans leading-tight">
              <AsciiMatrixText
                text="Engineer from India perpetually one git commit away from fixing the loss curve."
                duration={1300}
                delay={100}
              />{' '}
              <br />
              <span className="text-zinc-500 dark:text-zinc-400 font-normal text-lg sm:text-xl">
                Hi, I'm Shreyas.
              </span>
            </h1>

            <div className="space-y-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              <p>
                I make machines learn things. Sometimes they actually learn. Sometimes they just confidently hallucinate my hopes and dreams.
              </p>
              <p>
                I'm into <strong className="font-semibold text-zinc-900 dark:text-zinc-100">AI, ML, on-device vision, and browser agents</strong>, with an unhealthy curiosity for anything involving <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Python, WebGPU, and a GPU</strong>.
              </p>
              <p>
                Currently juggling a B.Sc. in Data Science at <strong className="font-semibold text-zinc-900 dark:text-zinc-100">IIT Madras</strong> and an Integrated MCA at <strong className="font-semibold text-zinc-900 dark:text-zinc-100">DAVV</strong> (because one degree clearly wasn't enough character development).
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                When I'm not studying, I'm probably building something, breaking something, or convincing myself that <span className="italic text-zinc-700 dark:text-zinc-300">"one more experiment"</span> is a reasonable use of my evening.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3 font-mono text-xs">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>

              <a
                href="/shreyas_namdeo_resume.pdf"
                download="Shreyas_Namdeo_Resume.pdf"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-medium hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume (PDF)</span>
              </a>

              <a
                href="https://www.linkedin.com/in/shreyas-namdeo-2119b0290/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-medium hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <ProjectsSection />

        {/* EXPERIENCE & LEADERSHIP */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/80">
          <ExperienceSection />
        </div>

        {/* EDUCATION */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/80">
          <EducationSection />
        </div>

        {/* SKILLS MATRIX */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/80">
          <SkillsMatrix />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
