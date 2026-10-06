import React, { useState } from 'react'
import { Github, ChevronDown, ChevronUp, Cpu } from 'lucide-react'

export interface ProjectData {
  id: string
  title: string
  subtitle: string
  stack: string[]
  metrics?: { label: string; value: string }[]
  highlights: string[]
  githubUrl: string
  interactiveComponent?: React.ReactNode
}

export const ProjectCard: React.FC<{ project: ProjectData; index: number }> = ({
  project,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="mb-1.5">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {project.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
            {project.subtitle}
          </p>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 text-xs font-mono transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Repository</span>
          </a>
        </div>
      </div>

      {/* Stack Badges */}
      <div className="flex flex-wrap gap-1.5 mt-3.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Metrics Row */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {project.metrics.map((m) => (
            <div key={m.label} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">{m.label}</div>
              <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bullet Points */}
      <ul className="mt-4 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans list-disc list-outside pl-4">
        {project.highlights.map((h, i) => (
          <li key={i} className="leading-relaxed">
            {h}
          </li>
        ))}
      </ul>

      {/* Interactive Expandable Toggle (only shown if present) */}
      {project.interactiveComponent && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-200/80 dark:border-zinc-700 font-mono text-xs text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>{expanded ? 'Hide Agent Architecture' : 'Inspect Agent Architecture & Live Trace'}</span>
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>

          {expanded && (
            <div className="animate-in fade-in-50 duration-200">
              {project.interactiveComponent}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
