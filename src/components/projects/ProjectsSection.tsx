import React from 'react'
import { ProjectCard, type ProjectData } from './ProjectCard'
import { AsciiSectionHeading } from '@/components/ascii/AsciiSectionHeading'

const PROJECTS: ProjectData[] = [
  {
    id: 'guptchara',
    title: 'GUPTCHARA',
    subtitle: 'On-device visual privacy agent with WebGPU-accelerated perception and zero-egress redaction',
    stack: ['WebGPU', 'ONNX Runtime', 'YOLOv26n', 'OmniParser INT8', 'TypeScript', 'Manifest V3'],
    metrics: [
      { label: 'Inference Latency', value: '< 25 ms' },
      { label: 'VRAM Footprint', value: '< 40 MB RAM' },
      { label: 'Privacy Barrier', value: 'Zero Egress' },
    ],
    highlights: [
      'Built for Smart India Hackathon (SIH26171 / ISRO PS-171), eliminating raw screen transmission to cloud VLMs during browser agent execution.',
      'Runs ONNX Runtime Web (ort-wasm-simd-threaded) with native WebGPU shaders for real-time on-device face & PII redaction.',
      'Fuses DOM interactive nodes with visual bounding boxes via Intersection-over-Union (IoU) to conquer canvas & WebGL blindspots.',
      'Engineered DPI-invariant Set-of-Mark (SoM) grounding and autonomous agent routing across Gemini Nano & local Ollama.',
    ],
    githubUrl: 'https://github.com/23f2005639/LWB-Exv2',
  },
  {
    id: 'code-review',
    title: 'AI Code Review System',
    subtitle: 'Multi-agent GitHub PR auditor with confidence gating and automated deduplication',
    stack: ['Python', 'LangGraph', 'LLMs', 'Agent Harness', 'AST Analysis'],
    metrics: [
      { label: 'Audit Cost', value: '~$0.005 / repo' },
      { label: 'Harness Stages', value: '10 Components' },
      { label: 'Confidence Gate', value: '>= 70% threshold' },
    ],
    highlights: [
      'Built a multi-agent harness that audits GitHub repositories with three specialist LLM agents (Security, Performance, and Style).',
      'Engineered a 10-component harness with a confidence cutoff gate that automatically retries low-confidence findings (< 70%).',
      'Integrated a validation gate that deduplicates overlapping AST spans and escalates critical CVSS vulnerabilities.',
      'Achieved average audit costs of ~$0.005 per repository in end-to-end test runs.',
    ],
    githubUrl: 'https://github.com/23f2005639',
  },
  {
    id: 'container-security',
    title: 'Multi-Agent Container Security System',
    subtitle: 'Real-time container vulnerability defense and automated attack mitigation',
    stack: ['Python', 'Multi-Agent Systems', 'Docker', 'Sandboxing', 'eBPF Telemetry'],
    metrics: [
      { label: 'Simulated Vectors', value: '5 Attack Techniques' },
      { label: 'Sandboxed Nodes', value: '3 Containers' },
      { label: 'Defense Agents', value: '4 Specialized LLMs' },
    ],
    highlights: [
      'Engineered a container security platform simulating 5 real attack techniques (Docker socket escape, namespace escape, Redis lateral movement, auth bypass, and CVE simulation).',
      'Isolated execution across 3 sandboxed vulnerable containers with real-time syscall interception.',
      'Coordinated 4 specialized AI agents scanning, monitoring, and mitigating threats in real time.',
    ],
    githubUrl: 'https://github.com/23f2005639',
  },
  {
    id: 'parking-forecasting',
    title: 'Spatio-Temporal Forecasting of Illegal Parking Hotspots',
    subtitle: 'Deep neural network predicting municipal enforcement demand across 7,814 zones',
    stack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Poisson Loss', 'Spatial Embeddings'],
    metrics: [
      { label: 'Grid Resolution', value: '7,814 Zones (Bengaluru)' },
      { label: 'Validation RMSE', value: '2.83' },
      { label: 'Validation MAE', value: '1.59' },
    ],
    highlights: [
      'Built a full-stack platform predicting illegal-parking hotspots across 7,814 Bengaluru grid zones using a custom spatio-temporal PyTorch neural network.',
      'Fused learned spatial embeddings with cyclic time features and trained under a custom Poisson loss function.',
      'Constructed a dispatch-routing and dynamic-tariff console for enforcement vehicle deployment.',
    ],
    githubUrl: 'https://github.com/23f2005639',
  },
]

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-12 sm:py-16">
      <AsciiSectionHeading
        title="FEATURED PROJECTS"
        subtitle="On-device visual perception, agentic harnesses, and spatio-temporal neural architectures."
      />

      <div className="space-y-6">
        {PROJECTS.map((proj, idx) => (
          <ProjectCard key={proj.id} project={proj} index={idx} />
        ))}
      </div>
    </section>
  )
}
