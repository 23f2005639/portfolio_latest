"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { ArrowUpRight } from "lucide-react";

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
    <section className="relative min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Dot grid fills top half */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-70" />
      {/* Fade the dot grid out downward */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

      <div className="h-16 shrink-0" />

      <div className="relative flex flex-1 items-start pt-12 md:items-center md:pt-0">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-20">

          {/* Mobile: photo on top */}
          <motion.div
            {...a(0.1)}
            className="mb-10 flex justify-center md:hidden"
          >
            <div className="relative h-40 w-40 overflow-hidden rounded-full border border-border">
              <Image
                src="/man.jpg"
                alt="Shreyas Namdeo"
                fill
                className="object-cover object-top"
                priority
                sizes="160px"
              />
            </div>
          </motion.div>

          <div className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between md:gap-16">

            {/* Text */}
            <div className="flex-1 max-w-xl">

              {/* Terminal-style prompt */}
              <motion.div {...a(0.05)} className="mb-5 inline-flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">$</span>
                  {" "}whoami<span className="ml-1 inline-block h-3.5 w-[1px] bg-foreground align-middle animate-[blink_1s_step-end_infinite]" />
                </span>
              </motion.div>

              <motion.h1 {...a(0.15)}
                className="mb-5 font-heading font-light leading-[0.95] tracking-tight text-foreground"
                style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
              >
                {profile.name.split(" ").map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </motion.h1>

              <motion.p {...a(0.28)}
                className="mb-8 font-mono text-sm text-muted-foreground leading-relaxed max-w-sm"
              >
                {profile.tagline}
              </motion.p>

              {/* Tags */}
              <motion.div {...a(0.38)} className="mb-8 flex flex-wrap gap-2">
                {["Agentic AI", "LangChain", "Python", "Open Source"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-border font-mono text-[11px] px-2.5 py-1 text-muted-foreground bg-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div {...a(0.48)} className="flex flex-wrap items-center gap-5">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-1.5 border border-foreground bg-foreground px-4 py-2 font-mono text-xs text-white transition-opacity hover:opacity-80 cursor-pointer"
                >
                  View projects <ArrowUpRight className="h-3 w-3" />
                </a>
                <a
                  href="#contact"
                  className="link-underline font-mono text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  Get in touch
                </a>
              </motion.div>

              <motion.div {...a(0.58)} className="mt-8 flex items-center gap-5 border-t border-border pt-6">
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <span className="font-mono text-xs text-muted-foreground/60">{profile.email}</span>
              </motion.div>
            </div>

            {/* Photo — desktop only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="hidden md:block shrink-0"
            >
              <div className="relative h-72 w-72 overflow-hidden rounded-full border border-border lg:h-80 lg:w-80">
                <Image
                  src="/man.jpg"
                  alt="Shreyas Namdeo"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1024px) 288px, 320px"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  );
}
