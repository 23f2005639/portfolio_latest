"use client";

import { motion, type Variants } from "framer-motion";
import { profile } from "@/data/profile";
import { Bot, Layers, Code2, Network, GitBranch } from "lucide-react";

const iconMap = {
  bot: Bot,
  layers: Layers,
  "code-2": Code2,
  network: Network,
  "git-branch": GitBranch,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function About() {
  return (
    <section id="about" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          custom={0} variants={fadeUp}
          className="mb-12 flex items-center gap-4"
        >
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-muted-foreground">
            [ABOUT]
          </span>
          <div className="flex-1 border-t border-border" />
        </motion.div>

        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20 items-start">

          {/* Bio */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            custom={1} variants={fadeUp}
          >
            <h2 className="mb-6 font-heading text-4xl font-light leading-tight text-foreground sm:text-5xl">
              About me
            </h2>

            {/* Model card header */}
            <div className="mb-4 px-4 py-2 flex items-center gap-3 border border-border bg-secondary/50">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                model_card
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                · type: student · domain: agentic-ai
              </span>
            </div>

            <p className="text-[0.95rem] leading-[1.9] text-muted-foreground font-light border-l-2 border-foreground pl-4">
              {profile.bio}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["AI / ML", "Web Dev", "Open Source", "Agentic Systems"].map((tag) => (
                <span
                  key={tag}
                  className="border border-border font-mono text-[11px] px-2.5 py-1 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Currently learning */}
          <div>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
              custom={1} variants={fadeUp}
              className="mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
            >
              // currently_learning
            </motion.p>
            <div className="flex flex-col">
              {profile.learning.map((item, i) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Bot;
                return (
                  <motion.div
                    key={item.label}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
                    custom={i + 2} variants={fadeUp}
                    className="flex items-start gap-3 py-3.5 px-2 -mx-2 border-b border-border last:border-none transition-colors duration-150 hover:bg-secondary/40 cursor-default"
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                    <div>
                      <p className="font-mono text-xs font-medium text-foreground">{item.label}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
