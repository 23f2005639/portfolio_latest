"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { ArrowUpRight, Download } from "lucide-react";
import { NeuralCanvas } from "@/components/magic/NeuralCanvas";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const ease = [0.25, 0.1, 0.25, 1] as const;
const a = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

export function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-white flex flex-col justify-center overflow-hidden">
      {/* Subtle monochrome neural canvas */}
      <NeuralCanvas />

      {/* Subtle scan line */}
      <div className="scan-line" />

      {/* Fade bottom into white */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="h-20 shrink-0" />

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            
            {/* Left Column — Title, tagline, tags & actions */}
            <div className="max-w-2xl">
              <motion.div {...a(0.05)} className="mb-6 inline-flex items-center gap-2 border-2 border-foreground bg-white px-3.5 py-1.5 font-mono text-sm font-semibold text-foreground">
                <span className="font-bold text-foreground">$</span> whoami
                <span
                  className="inline-block h-4 w-[2px] align-middle bg-foreground"
                  style={{ animation: "blink 1s step-end infinite" }}
                />
              </motion.div>

              <motion.h1
                {...a(0.15)}
                className="mb-6 font-heading font-light leading-[0.92] tracking-tight text-foreground"
                style={{ fontSize: "clamp(4rem, 8.5vw, 7rem)" }}
              >
                {profile.name}
              </motion.h1>

              <motion.p {...a(0.28)} className="mb-8 font-mono text-base font-normal text-foreground leading-relaxed max-w-xl">
                {profile.tagline}. Architecting deep learning models, neural pipelines with PyTorch, and agentic AI systems using LangChain.
              </motion.p>

              {/* Tags */}
              <motion.div {...a(0.38)} className="mb-10 flex flex-wrap gap-2.5">
                {["Core AI/ML", "PyTorch", "LangChain", "Deep Learning", "Open Source"].map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs font-medium px-3.5 py-1.5 border border-foreground text-foreground bg-white"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div {...a(0.48)} className="flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-6 py-3 font-mono text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                >
                  View projects <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="/shreyas_namdeo_resume.pdf"
                  download="Shreyas_Namdeo_Resume.pdf"
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-white px-6 py-3 font-mono text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-white cursor-pointer"
                >
                  Resume <Download className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="link-underline font-mono text-sm font-semibold text-foreground transition-colors hover:text-foreground/70 cursor-pointer px-2 py-2"
                >
                  Get in touch
                </a>
              </motion.div>

              {/* Socials & Email */}
              <motion.div
                {...a(0.58)}
                className="mt-12 flex items-center gap-6 border-t border-border pt-6"
              >
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-foreground transition-transform hover:scale-110 cursor-pointer">
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-foreground transition-transform hover:scale-110 cursor-pointer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <span className="font-mono text-sm font-semibold text-foreground">{profile.email}</span>
              </motion.div>
            </div>

            {/* Right Column — Developer Spec Card (Stack removed, Frameworks: PyTorch / LangChain) */}
            <motion.div
              {...a(0.35)}
              className="border-2 border-foreground bg-white p-6 shadow-md hidden lg:block"
            >
              <div className="flex items-center justify-between border-b-2 border-foreground pb-3 mb-5 font-mono text-sm">
                <span className="text-foreground font-bold uppercase tracking-wider text-xs">
                  // SYSTEM_SPEC
                </span>
                <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-medium">DEVELOPER</span>
                  <span className="text-foreground font-bold">{profile.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-medium">FOCUS</span>
                  <span className="text-foreground font-bold">Core AI / ML</span>
                </div>
                {/* Stack removed per user instruction */}
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-medium">FRAMEWORKS</span>
                  <span className="text-foreground font-bold">PyTorch / LangChain</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70 font-medium">STATUS</span>
                  <span className="text-foreground font-bold">Building in Public</span>
                </div>
              </div>
              <div className="mt-6 border-t-2 border-foreground pt-4 font-mono text-xs">
                <div className="flex justify-between text-foreground font-semibold mb-2">
                  <span>SYSTEM_LOAD</span>
                  <span className="text-emerald-600 font-bold">OPTIMAL</span>
                </div>
                <div className="h-2 w-full bg-secondary overflow-hidden border border-foreground">
                  <div className="h-full bg-foreground w-5/6" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <div className="border-t border-border" />
    </section>
  );
}
