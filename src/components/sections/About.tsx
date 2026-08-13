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
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-foreground">
            [ABOUT]
          </span>
          <div className="flex-1 border-t-2 border-foreground/30" />
        </motion.div>

        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20 items-start">

          {/* Bio */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            custom={1} variants={fadeUp}
          >
            <h2 className="mb-6 font-heading text-5xl font-light leading-tight text-foreground sm:text-6xl">
              About me
            </h2>

            {/* Model card header */}
            <div className="mb-6 px-4 py-2.5 flex items-center gap-3 border-2 border-foreground bg-secondary">
              <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                model_card
              </span>
              <span className="font-mono text-xs font-semibold text-foreground">
                · domain: core-ai/ml · framework: pytorch / langchain
              </span>
            </div>

            <p className="text-base leading-relaxed text-foreground font-medium border-l-4 border-foreground pl-4">
              {profile.bio}
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {["Core AI / ML", "PyTorch", "LangChain", "Deep Learning", "Open Source"].map((tag) => (
                <span
                  key={tag}
                  className="border border-foreground bg-white font-mono text-xs font-semibold px-3 py-1.5 text-foreground"
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
              className="mb-6 font-mono text-xs font-bold tracking-[0.2em] uppercase text-foreground"
            >
              // CURRENTLY_EXPLORING
            </motion.p>
            <div className="flex flex-col gap-2">
              {profile.learning.map((item, i) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Bot;
                return (
                  <motion.div
                    key={item.label}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
                    custom={i + 2} variants={fadeUp}
                    className="flex items-start gap-4 py-4 px-3 border-2 border-foreground bg-white transition-colors duration-150 hover:bg-secondary cursor-default shadow-xs"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">{item.label}</p>
                      <p className="mt-1 font-mono text-xs font-medium text-foreground leading-relaxed">
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
