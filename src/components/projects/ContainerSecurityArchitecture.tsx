import React, { useState } from 'react'
import { Server, Shield, Radio, Terminal, AlertOctagon, CheckCircle2, Play } from 'lucide-react'

interface AttackScenario {
  id: string
  name: string
  container: string
  vector: string
  mitigation: string
  agent: string
}

const ATTACKS: AttackScenario[] = [
  {
    id: 'docker-socket',
    name: 'Docker Socket Escape',
    container: 'Container-A (Web Frontend)',
    vector: 'Mounted /var/run/docker.sock abused to spawn privileged container on host',
    agent: 'Host Socket Guardian',
    mitigation: 'Revokes mounted socket pipe, quarantines PID 3891, emits critical CVE alert',
  },
  {
    id: 'namespace-escape',
    name: 'Kernel Namespace Escape',
    container: 'Container-B (Worker Node)',
    vector: 'Exploitation of unshared PID/cgroup namespace boundaries via seccomp bypass',
    agent: 'Kernel Namespace Auditor',
    mitigation: 'Enforces strict eBPF seccomp policy, severs worker host IPC channel',
  },
  {
    id: 'redis-lateral',
    name: 'Redis Lateral Movement',
    container: 'Container-C (Internal Cache)',
    vector: 'Unauthenticated Redis CONFIG SET abuse attempting lateral host write',
    agent: 'Network Flow Tracker',
    mitigation: 'Reroutes packet mesh to blackhole sandbox, rotates Redis authentication token',
  },
  {
    id: 'auth-bypass',
    name: 'API Auth Bypass',
    container: 'Container-A (Web Frontend)',
    vector: 'Malformed JWT claim headers bypassing middleware auth barrier',
    agent: 'Application Perimeter Sentinel',
    mitigation: 'Injects dynamic WAF rule, invalidates public token session ring',
  },
  {
    id: 'cve-sim',
    name: 'Known CVE Injection',
    container: 'Container-B (Worker Node)',
    vector: 'Simulated glibc vulnerability payload executing shell command stream',
    agent: 'Vulnerability CVE Scanner',
    mitigation: 'Detects payload signature, tears down container replica, triggers patched redeploy',
  },
]

export const ContainerSecurityArchitecture: React.FC = () => {
  const [selectedAttack, setSelectedAttack] = useState<AttackScenario>(ATTACKS[0])
  const [simStatus, setSimStatus] = useState<'idle' | 'executing' | 'intercepted'>('idle')
  const [logMessages, setLogMessages] = useState<string[]>([])

  const triggerAttack = (attack: AttackScenario) => {
    setSelectedAttack(attack)
    setSimStatus('executing')
    setLogMessages([
      `[SIM_INIT] Launching technique: ${attack.name}`,
      `[TARGET] Targeting ${attack.container}...`,
    ])

    setTimeout(() => {
      setLogMessages((prev) => [
        ...prev,
        `[DETECTED] ${attack.agent} captured abnormal syscall stream!`,
        `[VECTOR] ${attack.vector}`,
      ])
    }, 600)

    setTimeout(() => {
      setLogMessages((prev) => [
        ...prev,
        `[ACTION] Mitigating threat: ${attack.mitigation}`,
        `[STATUS] Threat quarantined. System state healthy.`,
      ])
      setSimStatus('intercepted')
    }, 1400)
  }

  return (
    <div className="mt-4 pt-4 border-t border-zinc-200 bg-zinc-50/60 rounded-xl p-4 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200">
        <span className="font-semibold text-zinc-900 tracking-wider">
          CONTAINER DEFENSE · 3 SANDBOXED NODES & 4 MONITORING AGENTS
        </span>
        <span className="text-[10px] text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
          5 ATTACK TECHNIQUES
        </span>
      </div>

      {/* 3 Sandboxed Containers */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { name: 'Container-A (Web)', role: 'Exposed Edge Service', ip: '10.0.1.4' },
          { name: 'Container-B (Worker)', role: 'Background Async Tasks', ip: '10.0.1.7' },
          { name: 'Container-C (Redis)', role: 'In-Memory Cache & Bus', ip: '10.0.1.12' },
        ].map((node) => (
          <div key={node.name} className="p-2.5 bg-white rounded-lg border border-zinc-200 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900 mb-1">
              <Server className="w-3.5 h-3.5 text-zinc-600" />
              <span>{node.name}</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-sans">{node.role}</p>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400">
              <span>{node.ip}</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Isolated
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Attack Selection Pills */}
      <div className="mt-4">
        <div className="text-[11px] font-bold text-zinc-700 mb-2">
          SELECT SIMULATED ATTACK TECHNIQUE:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ATTACKS.map((atk) => (
            <button
              key={atk.id}
              onClick={() => triggerAttack(atk)}
              className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedAttack.id === atk.id
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400'
              }`}
            >
              <AlertOctagon className="w-3 h-3 text-rose-500" />
              <span>{atk.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Defense Simulation Output */}
      <div className="mt-4 p-3 bg-zinc-950 text-zinc-100 rounded-lg font-mono text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[10px]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>AGENT_TELEMETRY_LOG</span>
          </span>
          <span>
            {simStatus === 'executing' ? (
              <span className="text-amber-400 animate-pulse">● INTERCEPTING...</span>
            ) : simStatus === 'intercepted' ? (
              <span className="text-emerald-400 font-bold">● NEUTRALIZED</span>
            ) : (
              <span className="text-zinc-500">READY</span>
            )}
          </span>
        </div>

        {logMessages.length === 0 ? (
          <div className="text-zinc-500 py-3 text-center">
            Click any attack technique above to simulate the 4-agent detection loop.
          </div>
        ) : (
          logMessages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.includes('[SIM_INIT]')
                  ? 'text-zinc-400'
                  : msg.includes('[DETECTED]')
                  ? 'text-amber-300 font-bold'
                  : msg.includes('[ACTION]')
                  ? 'text-cyan-300'
                  : msg.includes('[STATUS]')
                  ? 'text-emerald-400 font-bold'
                  : 'text-zinc-300'
              }`}
            >
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
