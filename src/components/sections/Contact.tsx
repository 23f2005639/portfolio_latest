"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { profile } from "@/data/profile";
import { Mail, Copy, Check } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="contact" className="bg-secondary/40 py-24 md:py-32 border-t-2 border-border">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-foreground">
            [CONTACT]
          </span>
          <div className="flex-1 border-t-2 border-foreground/30" />
        </div>

        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-20 items-start">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="font-heading text-5xl font-light leading-tight text-foreground sm:text-6xl mb-6">
              Let&apos;s connect
            </h2>
            <p className="font-mono text-base font-medium leading-relaxed text-foreground mb-8">
              Whether you want to discuss Core AI/ML research, collaborate on PyTorch & LangChain agentic systems, or swap ideas — my inbox is open.
            </p>
            <div className="flex items-center gap-6">
              <a href={`mailto:${profile.email}`} aria-label="Email"
                className="text-foreground transition-transform hover:scale-110 cursor-pointer">
                <Mail className="h-6 w-6" />
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="text-foreground transition-transform hover:scale-110 cursor-pointer">
                <GithubIcon className="h-6 w-6" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="text-foreground transition-transform hover:scale-110 cursor-pointer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="border-2 border-foreground bg-white p-6 shadow-md"
          >
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              // SEND_DIRECT_MESSAGE
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-secondary/80 p-3.5 border-2 border-foreground/30">
              <span className="font-mono text-sm font-bold text-foreground truncate">{profile.email}</span>
              <button
                onClick={copyEmail}
                aria-label="Copy email"
                className="flex shrink-0 items-center justify-center gap-2 border-2 border-foreground bg-white px-4 py-2 font-mono text-xs font-bold text-foreground transition-colors hover:bg-foreground hover:text-white cursor-pointer"
              >
                {copied
                  ? <><Check className="h-4 w-4" /> Copied</>
                  : <><Copy className="h-4 w-4" /> Copy Email</>
                }
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
