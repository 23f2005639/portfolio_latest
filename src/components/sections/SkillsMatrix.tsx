import React from 'react'
import { AsciiSectionHeading } from '@/components/ascii/AsciiSectionHeading'
import { Terminal, Cpu, Wrench } from 'lucide-react'

interface SkillCategory {
  title: string
  icon: React.ReactNode
  skills: string[]
}

const CATEGORIES: SkillCategory[] = [
  {
    title: 'Languages & Core Frameworks',
    icon: <Terminal className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    skills: [
      'Python (Advanced)',
      'PyTorch',
      'TypeScript / JS',
      'WebGPU & Shaders',
      'ONNX Runtime Web',
      'LangChain',
      'LangGraph',
      'FastAPI & Flask',
      'HuggingFace Transformers',
      'NumPy & Pandas',
    ],
  },
  {
    title: 'Agentic AI & Computer Vision',
    icon: <Cpu className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    skills: [
      'Autonomous Browser Agents',
      'YOLOv26 & OmniParser Vision',
      'Multi-Agent Harnesses',
      'Retrieval-Augmented Generation (RAG)',
      'Vector Databases (FAISS, Chroma)',
      'Set-of-Mark (SoM) Grounding',
      'Small Language Models (SLMs)',
      'Zero-Egress Privacy Redaction',
      'Spatio-Temporal Modeling',
    ],
  },
  {
    title: 'Infrastructure & Engineering Tools',
    icon: <Wrench className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />,
    skills: [
      'Docker & Container Sandboxing',
      'Linux Kernel & eBPF Telemetry',
      'Chrome & Firefox Extensions (MV3)',
      'Git & GitHub Actions',
      'Shell Scripting (Bash)',
      'n8n Workflow Automation',
      'Vercel Deployment',
    ],
  },
]

export const SkillsMatrix: React.FC = () => {
  return (
    <section id="skills" className="py-12 sm:py-16">
      <AsciiSectionHeading
        title="TECHNICAL COMPETENCIES"
        subtitle="Core engineering stack, on-device vision, and machine learning infrastructure."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <span className="p-1 rounded bg-zinc-100 dark:bg-zinc-800">{cat.icon}</span>
              <span>{cat.title}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-750 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
