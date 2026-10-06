import React, { useState } from 'react'
import { ShieldAlert, Zap, Palette, ArrowRight, Play, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react'

export const CodeReviewArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flow' | 'simulation' | 'metrics'>('flow')
  const [simStep, setSimStep] = useState<number>(0)
  const [simRunning, setSimRunning] = useState<boolean>(false)

  const steps = [
    { title: 'Repo Ingestion & AST Parsing', detail: 'Decomposes PR files into parsed syntax chunks & symbol references' },
    { title: 'Specialist Agent Dispatch', detail: 'Spawns 3 specialized LLM agents concurrently (Security, Performance, Style)' },
    { title: 'Confidence Scoring (<70% Gate)', detail: 'Confidence gate evaluates findings. Findings below 70% threshold trigger retry' },
    { title: 'Deduplication & Escalation Gate', detail: 'Merges overlapping findings, deduplicates AST spans, escalates critical flaws' },
    { title: 'Audit Report Generation', detail: 'Emits structured JSON/Markdown audit report with actionable remediation diffs' },
  ]

  const runSimulation = () => {
    setSimRunning(true)
    setSimStep(0)
    let current = 0
    const interval = setInterval(() => {
      current++
      if (current < steps.length) {
        setSimStep(current)
      } else {
        clearInterval(interval)
        setSimRunning(false)
      }
    }, 700)
  }

  return (
    <div className="mt-4 pt-4 border-t border-zinc-200 bg-zinc-50/60 rounded-xl p-4 font-mono text-xs">
      {/* Sub tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200">
        <span className="font-semibold text-zinc-900 tracking-wider">
          AGENT TOPOLOGY · LANGGRAPH 10-COMPONENT HARNESS
        </span>
        <div className="flex items-center gap-1">
          {(['flow', 'simulation', 'metrics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-[11px] capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'flow' && (
        <div className="mt-4 space-y-4">
          {/* Agent Harness Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Agent 1 */}
            <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-600 font-bold mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Security Specialist</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">
                Detects SQL injection, privilege escalation, unvalidated input, and API key leaks.
              </p>
              <div className="mt-2 text-[10px] text-zinc-400 bg-zinc-50 p-1.5 rounded">
                Model: Fine-tuned Llama-3 / GPT-4o-mini
              </div>
            </div>

            {/* Agent 2 */}
            <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-600 font-bold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Performance Specialist</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">
                Flags N+1 queries, memory leaks, blocking loops, and redundant database roundtrips.
              </p>
              <div className="mt-2 text-[10px] text-zinc-400 bg-zinc-50 p-1.5 rounded">
                Verification: Profiling AST heuristics
              </div>
            </div>

            {/* Agent 3 */}
            <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Style & Idiom Specialist</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">
                Enforces PEP 8, strict type hints, docstring integrity, and idiomatic abstractions.
              </p>
              <div className="mt-2 text-[10px] text-zinc-400 bg-zinc-50 p-1.5 rounded">
                Enforcement: Linter AST congruence
              </div>
            </div>
          </div>

          {/* Validation Gates */}
          <div className="p-3 bg-white rounded-lg border border-zinc-200">
            <div className="text-[11px] font-bold text-zinc-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              <span>Pipeline Decision Gates (LangGraph StateGraph):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-zinc-50 rounded border border-zinc-100">
                <span className="font-bold text-zinc-900">70% Confidence Threshold Gate:</span>
                <p className="text-zinc-500 font-sans mt-0.5">
                  Filters noisy hallucinated findings. If confidence &lt; 0.70, triggers prompt refinement retry loop.
                </p>
              </div>
              <div className="p-2 bg-zinc-50 rounded border border-zinc-100">
                <span className="font-bold text-zinc-900">Deduplication & Escalation:</span>
                <p className="text-zinc-500 font-sans mt-0.5">
                  Fuses multi-agent findings overlapping the same code spans; escalates high-severity CVSS risks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <span className="text-[11px] text-zinc-600">Simulate repository audit cycle:</span>
            <button
              onClick={runSimulation}
              disabled={simRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded text-[11px] font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {simRunning ? <RotateCcw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              <span>{simRunning ? 'Auditing...' : 'Run Simulation'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isPast = idx < simStep
              const isCurrent = idx === simStep
              return (
                <div
                  key={step.title}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-white border-zinc-900 shadow-2xs font-semibold'
                      : isPast
                      ? 'bg-white/80 border-zinc-200 text-zinc-700'
                      : 'bg-zinc-100/50 border-zinc-200/60 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-zinc-200 shrink-0 flex items-center justify-center text-[9px] text-zinc-500">
                        {idx + 1}
                      </span>
                    )}
                    <span className="text-zinc-900">{step.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-sans mt-1 pl-5.5">{step.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-3 bg-white rounded-lg border border-zinc-200">
            <div className="text-[10px] text-zinc-400 uppercase">Audit Cost</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">~$0.005</div>
            <div className="text-[10px] text-emerald-600 font-sans mt-0.5">Per repo analyzed</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-zinc-200">
            <div className="text-[10px] text-zinc-400 uppercase">Harness Gates</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">10 Stages</div>
            <div className="text-[10px] text-zinc-500 font-sans mt-0.5">LangGraph pipeline</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-zinc-200">
            <div className="text-[10px] text-zinc-400 uppercase">Confidence Cutoff</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">&gt;= 70%</div>
            <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Auto-retry threshold</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-zinc-200">
            <div className="text-[10px] text-zinc-400 uppercase">Agent Count</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">3 LLMs</div>
            <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Security, Perf, Style</div>
          </div>
        </div>
      )}
    </div>
  )
}
