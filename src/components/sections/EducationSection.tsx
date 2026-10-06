import React from 'react'
import { AsciiSectionHeading } from '@/components/ascii/AsciiSectionHeading'
import { Award } from 'lucide-react'

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-12 sm:py-16">
      <AsciiSectionHeading
        title="EDUCATION & CERTIFICATIONS"
        subtitle="Foundations in data science, computer applications, and deep learning."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* IIT Madras */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200">
                IIT MADRAS
              </span>
              <span>2023 - 2027</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              B.Sc. in Data Science and Programming
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Indian Institute of Technology Madras (Distance Learning)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Cumulative Academic Standing</span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-mono text-xs font-bold">
              GPA: 8.23 / 10.0
            </span>
          </div>
        </div>

        {/* DAVV */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-800 dark:text-zinc-200">
                IIPS, DAVV
              </span>
              <span>2023 - 2028</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Integrated Master’s in Computer Application
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              International Institute of Professional Studies, DAVV (5-Year Program)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span>Specialization Track</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Software Systems & Algorithms</span>
          </div>
        </div>
      </div>

      {/* Certification Banner */}
      <div className="mt-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Applications of AI for Anomaly Detection</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                NVIDIA
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Certified in unsupervised anomaly identification, autoencoders, and statistical outlier telemetry.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 shrink-0 self-end sm:self-auto">
          Issued Jan 2026
        </div>
      </div>
    </section>
  )
}
