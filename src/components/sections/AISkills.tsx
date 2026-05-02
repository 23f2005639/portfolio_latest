"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const skills = [
  { name: "Python",                    level: 90, cat: "core"  },
  { name: "LangChain / LlamaIndex",    level: 87, cat: "ai"    },
  { name: "RAG & Agentic Systems",     level: 85, cat: "ai"    },
  { name: "OpenAI / HuggingFace APIs", level: 83, cat: "ai"    },
  { name: "Machine Learning",          level: 76, cat: "ai"    },
  { name: "FastAPI / REST",            level: 80, cat: "web"   },
  { name: "React / TypeScript",        level: 74, cat: "web"   },
  { name: "Docker / Linux",            level: 70, cat: "infra" },
];

const catColor: Record<string, string> = {
  ai:    "#0a0a0a",
  core:  "#3a3a3a",
  web:   "#5a5a5a",
  infra: "#8a8a8a",
};
const catLabel: Record<string, string> = {
  ai: "AI/ML", core: "Core", web: "Web", infra: "Infra",
};

const QUESTIONS = [
  {
    q: 'What does "RAG" stand for?',
    opts: ["Recursive Attention Graph", "Retrieval-Augmented Generation", "Random Activation Gate", "Residual Aggregation"],
    ans: 1,
    fact: "RAG grounds LLMs in external knowledge to reduce hallucinations.",
  },
  {
    q: "Which architecture powers modern LLMs?",
    opts: ["Convolutional Neural Net", "Recurrent Neural Net", "Transformer", "Boltzmann Machine"],
    ans: 2,
    fact: "Transformers use self-attention, enabling parallelism and long-range context.",
  },
  {
    q: 'What does "temperature" control in LLM output?',
    opts: ["Inference speed", "Randomness of tokens", "Model size", "Context length"],
    ans: 1,
    fact: "Higher temperature → more creative/random; lower → more deterministic.",
  },
  {
    q: "RLHF stands for:",
    opts: ["Recursive Layer Hierarchy Fusion", "Regularized Loss with Hyperfeatures", "Reinforcement Learning from Human Feedback", "Random Label Hypothesis Function"],
    ans: 2,
    fact: "RLHF is how ChatGPT and Claude were aligned to human preferences.",
  },
  {
    q: "What is an 'agent' in agentic AI?",
    opts: ["A fine-tuned model", "An LLM that uses tools to act autonomously", "A type of embedding", "A retrieval index"],
    ans: 1,
    fact: "Agents plan, call tools, observe results, and iterate — like a loop.",
  },
  {
    q: "Which library is LangChain designed for?",
    opts: ["Building LLM-powered pipelines", "Neural network training", "Data annotation", "Model compression"],
    ans: 0,
    fact: "LangChain chains prompts, tools, memory, and retrievers into pipelines.",
  },
  {
    q: "LLM 'hallucination' means:",
    opts: ["Slow inference", "Visual generation glitches", "Generating confident but false info", "Overfitting to training data"],
    ans: 2,
    fact: "Hallucinations are a core challenge — RAG and grounding help mitigate them.",
  },
  {
    q: "What is 'fine-tuning' an LLM?",
    opts: ["Compressing model weights", "Further training on domain-specific data", "Changing the tokenizer", "Adding more attention heads"],
    ans: 1,
    fact: "Fine-tuning adapts a pretrained model to specific tasks or styles.",
  },
];

const LABELS = ["A", "B", "C", "D"];

type Phase = "idle" | "playing" | "reveal" | "done";

function AIQuizGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = QUESTIONS[qIdx];
  const isCorrect = picked === q.ans;

  const start = useCallback(() => {
    setQIdx(0);
    setScore(0);
    setPicked(null);
    setPhase("playing");
  }, []);

  const pick = useCallback((i: number) => {
    if (phase !== "playing") return;
    setPicked(i);
    if (i === QUESTIONS[qIdx].ans) setScore(s => s + 1);
    setPhase("reveal");
  }, [phase, qIdx]);

  const next = useCallback(() => {
    const nextIdx = qIdx + 1;
    if (nextIdx >= QUESTIONS.length) {
      setPhase("done");
    } else {
      setQIdx(nextIdx);
      setPicked(null);
      setPhase("playing");
    }
  }, [qIdx]);

  if (phase === "idle") {
    return (
      <div className="p-5 font-mono text-[11px]">
        <p className="text-muted-foreground mb-1">
          <span className="text-foreground font-medium">$</span> quiz.run(topic=&quot;ai_ml&quot;)
        </p>
        <p className="text-muted-foreground mb-4">
          <span>&gt;</span> {QUESTIONS.length} questions loaded
        </p>
        <div className="my-4 border-t border-border" />
        <p className="text-muted-foreground text-[10px] mb-4 leading-relaxed">
          Test your AI/ML knowledge.<br />
          Score is tracked — no retries per question.
        </p>
        <button
          onClick={start}
          className="w-full border border-foreground bg-foreground text-white font-mono text-[11px] py-2 px-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          ▶ start_quiz()
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const grade =
      pct >= 90 ? "S — genius tier" :
      pct >= 70 ? "A — solid engineer" :
      pct >= 50 ? "B — keep studying" :
      "C — touch grass & retry";
    return (
      <div className="p-5 font-mono text-[11px]">
        <p className="text-muted-foreground mb-1">
          <span className="text-foreground font-medium">$</span> quiz.results()
        </p>
        <div className="my-3 border-t border-border" />
        <div className="space-y-1.5 mb-4">
          <p className="text-muted-foreground">
            <span>&gt;</span> score:{" "}
            <span className="text-foreground font-medium">{score}/{QUESTIONS.length}</span>
          </p>
          <p className="text-muted-foreground">
            <span>&gt;</span> accuracy:{" "}
            <span className="text-foreground font-medium">{pct}%</span>
          </p>
          <p className="text-muted-foreground">
            <span>&gt;</span> grade:{" "}
            <span className="text-foreground font-medium">{grade}</span>
          </p>
        </div>
        <div className="relative h-[3px] w-full rounded-full bg-black/8 overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.34, 1.2, 0.64, 1] }}
            className="absolute inset-y-0 left-0 rounded-full bg-foreground"
          />
        </div>
        <button
          onClick={start}
          className="w-full border border-border text-muted-foreground font-mono text-[11px] py-2 px-4 hover:border-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          ↺ restart_quiz()
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 font-mono text-[11px]">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
          Q{qIdx + 1}/{QUESTIONS.length}
        </span>
        <span className="text-muted-foreground text-[10px]">
          score: <span className="text-foreground">{score}</span>
        </span>
      </div>
      <div className="relative h-[2px] w-full bg-black/6 mb-4 overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-foreground rounded-full transition-all duration-300"
          style={{ width: `${((qIdx) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="text-muted-foreground mb-1">
        <span className="text-foreground font-medium">$</span> model.query()
      </p>
      <p className="text-foreground mb-4 leading-relaxed">&gt; {q.q}</p>

      {/* Options */}
      <div className="space-y-1.5">
        {q.opts.map((opt, i) => {
          let classes =
            "w-full text-left px-3 py-2 border font-mono text-[10px] leading-snug transition-colors duration-150 cursor-pointer ";
          if (phase === "playing") {
            classes += "border-border text-muted-foreground hover:border-foreground hover:text-foreground";
          } else {
            if (i === q.ans) {
              classes += "border-green-600 text-green-700 bg-green-50";
            } else if (i === picked && !isCorrect) {
              classes += "border-red-400 text-red-500 bg-red-50";
            } else {
              classes += "border-border text-muted-foreground/40";
            }
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={phase === "reveal"} className={classes}>
              <span className="mr-2 opacity-50">[{LABELS[i]}]</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Reveal feedback */}
      {phase === "reveal" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4"
        >
          <div className="border-t border-border pt-3">
            <p className={`mb-1 font-medium ${isCorrect ? "text-green-700" : "text-red-500"}`}>
              {isCorrect ? "✓ correct" : "✗ wrong"}
            </p>
            <p className="text-muted-foreground text-[10px] leading-relaxed mb-3">{q.fact}</p>
            <button
              onClick={next}
              className="w-full border border-foreground bg-foreground text-white font-mono text-[11px] py-1.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {qIdx + 1 >= QUESTIONS.length ? "see results →" : "next →"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SkillBar({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const color = catColor[skill.cat];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -14 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.065, ease: "easeOut" }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-mono text-[11px] text-foreground/80 truncate">{skill.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="font-mono text-[9px] px-1.5 py-0.5 border"
            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}06` }}
          >
            {catLabel[skill.cat]}
          </span>
          <span className="font-mono text-[10px]" style={{ color }}>{skill.level}%</span>
        </div>
      </div>
      <div className="relative mb-4 h-[2px] w-full overflow-hidden rounded-full bg-black/6">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay: index * 0.065 + 0.25, ease: [0.34, 1.2, 0.64, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function AISkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} id="skills" className="bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-muted-foreground">
            [AI / ML STACK]
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="font-mono text-[10px] px-2 py-0.5 border border-border text-muted-foreground">
            v0.x learning
          </span>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">

          {/* Left — skill bars */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6 font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground"
            >
              // capability_matrix
            </motion.p>
            <div>
              {skills.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>

          {/* Right — terminal quiz game */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className="border border-border bg-white"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 bg-secondary/60">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">ai_quiz.sh</span>
            </div>
            <AIQuizGame />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
