import React from 'react'
import { AsciiSectionHeading } from '@/components/ascii/AsciiSectionHeading'
import { Briefcase, Users, Code, Calendar, CheckCircle2 } from 'lucide-react'

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-12 sm:py-16">
      <AsciiSectionHeading
        title="EXPERIENCE & LEADERSHIP"
        subtitle="Workshops, student mentorship, and engineering tracks."
      />

      <div className="relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-zinc-800 space-y-8">
        {/* Timeline Item */}
        <div className="relative group">
          {/* Dot */}
          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-white border-4 border-white dark:border-zinc-950 shadow-2xs group-hover:scale-125 transition-transform" />

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <Briefcase className="w-4 h-4" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  AI / ML Lead
                </h3>
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">@ GDSC IIPS, DAVV</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Concluded</span>
                </span>
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>2025 – 2026</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans mt-2 leading-relaxed">
              Led the artificial intelligence and machine learning division, structuring practical curriculum for hands-on student projects and hackathon acceleration.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  Ran AI/ML workshops and project tracks for club members, guiding applied ML and agentic-AI builds from initial idea to working demos.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Code className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                  Mentored student teams on hackathon submissions and helped scope technical system architectures across the club’s AI/ML initiatives.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
