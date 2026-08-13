"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowUpRight, Terminal } from "lucide-react";

const QUESTIONS = [
  {
    q: "Which PyTorch method computes backpropagation gradients?",
    opts: ["model.fit()", "loss.backward()", "optimizer.step()", "torch.forward()"],
    ans: 1,
    fact: "loss.backward() calculates gradients using reverse-mode automatic differentiation.",
  },
  {
    q: 'What is the primary role of "LangChain" in AI development?',
    opts: ["Training raw weights", "Chaining LLMs, prompts, tools, and retrievers", "Hardware acceleration", "Data annotation"],
    ans: 1,
    fact: "LangChain connects foundation models with external tools, APIs, and memory.",
  },
  {
    q: "In Transformer models, what mechanism computes token relationships?",
    opts: ["Convolutional Kernels", "Self-Attention", "Recurrent Gates", "Pool Layers"],
    ans: 1,
    fact: "Self-attention computes dynamic weight matrices across all sequence tokens in parallel.",
  },
  {
    q: 'What does "RAG" stand for in modern AI architecture?',
    opts: ["Recursive Attention Graph", "Retrieval-Augmented Generation", "Random Activation Gate", "Residual Aggregation"],
    ans: 1,
    fact: "RAG grounds LLMs in external knowledge bases to mitigate hallucinations.",
  },
  {
    q: "What does an 'Agent' do in agentic workflows?",
    opts: ["Runs static SQL queries", "Plans, calls tools, observes outputs, and iterates autonomously", "Compresses image pixels", "Renders HTML templates"],
    ans: 1,
    fact: "Agents operate in feedback loops using tools to accomplish complex multi-step goals.",
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
      <div className="p-6 font-mono text-sm">
        <div className="flex items-center gap-2 mb-3 text-foreground font-bold">
          <Terminal className="h-4 w-4" />
          <span>$ core_ai_test.sh</span>
        </div>
        <p className="text-foreground font-medium mb-4">
          &gt; {QUESTIONS.length} core AI/ML verification questions loaded
        </p>
        <div className="my-4 border-t-2 border-foreground" />
        <p className="text-foreground text-xs mb-5 leading-relaxed">
          Evaluate core AI concepts: PyTorch automatic differentiation, LangChain agents, Transformer self-attention, and RAG architectures.
        </p>
        <button
          onClick={start}
          className="w-full border-2 border-foreground bg-foreground text-white font-mono text-xs font-bold py-2.5 px-4 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
        >
          ▶ RUN_AI_TEST()
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="p-6 font-mono text-sm">
        <p className="text-foreground font-bold mb-2">
          $ test.results()
        </p>
        <div className="my-3 border-t-2 border-foreground" />
        <div className="space-y-2 mb-5">
          <p className="text-foreground font-medium">
            &gt; score: <span className="font-bold">{score}/{QUESTIONS.length}</span>
          </p>
          <p className="text-foreground font-medium">
            &gt; accuracy: <span className="font-bold">{pct}%</span>
          </p>
        </div>
        <div className="relative h-2 w-full border border-foreground bg-secondary overflow-hidden mb-5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.34, 1.2, 0.64, 1] }}
            className="absolute inset-y-0 left-0 bg-foreground"
          />
        </div>
        <button
          onClick={start}
          className="w-full border-2 border-foreground bg-white text-foreground font-mono text-xs font-bold py-2.5 px-4 hover:bg-foreground hover:text-white transition-colors cursor-pointer"
        >
          ↺ RESTART_TEST()
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 font-mono text-sm">
      <div className="flex items-center justify-between mb-3 font-semibold text-xs">
        <span className="text-foreground uppercase">
          Q{qIdx + 1}/{QUESTIONS.length}
        </span>
        <span className="text-foreground">
          SCORE: <span className="font-bold">{score}</span>
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-secondary mb-4 overflow-hidden border border-foreground/30">
        <div
          className="absolute inset-y-0 left-0 bg-foreground transition-all duration-300"
          style={{ width: `${((qIdx) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <p className="text-foreground font-bold mb-1">$ query()</p>
      <p className="text-foreground font-semibold mb-4 leading-relaxed">&gt; {q.q}</p>

      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          let classes =
            "w-full text-left px-3.5 py-2.5 border-2 font-mono text-xs leading-snug transition-colors cursor-pointer ";
          if (phase === "playing") {
            classes += "border-foreground/40 text-foreground hover:border-foreground hover:bg-secondary/60";
          } else {
            if (i === q.ans) {
              classes += "border-foreground text-foreground bg-secondary font-bold";
            } else if (i === picked && !isCorrect) {
              classes += "border-foreground/20 text-foreground/40 line-through";
            } else {
              classes += "border-foreground/20 text-foreground/30";
            }
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={phase === "reveal"} className={classes}>
              <span className="mr-2 font-bold opacity-70">[{LABELS[i]}]</span>
              {opt}
            </button>
          );
        })}
      </div>

      {phase === "reveal" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 border-t-2 border-foreground pt-3"
        >
          <p className="mb-1 font-bold text-foreground">
            {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
          </p>
          <p className="text-foreground text-xs leading-relaxed mb-4">{q.fact}</p>
          <button
            onClick={next}
            className="w-full border-2 border-foreground bg-foreground text-white font-mono text-xs font-bold py-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            {qIdx + 1 >= QUESTIONS.length ? "SEE RESULTS →" : "NEXT QUESTION →"}
          </button>
        </motion.div>
      )}
    </div>
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
    <section ref={sectionRef} id="spells" className="bg-secondary/30 py-24 md:py-32 border-t-2 border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Section Header: SPELLS ONLY */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-foreground">
            [SPELLS]
          </span>
          <div className="flex-1 border-t-2 border-foreground/30" />
          <Link
            href="/spells"
            className="inline-flex items-center gap-1.5 border-2 border-foreground bg-white px-3.5 py-1.5 font-mono text-xs font-bold text-foreground hover:bg-foreground hover:text-white transition-colors cursor-pointer"
          >
            Open Spells Page <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">

          {/* Left Column — Clean Coming Soon Box with Vibrant Dots */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className="border-2 border-foreground bg-white p-8 md:p-10 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {/* Vibrant status dots */}
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <span className="font-mono text-xs font-bold text-foreground bg-secondary px-3 py-1 border border-foreground/30">
                  STATUS: UPCOMING
                </span>
              </div>

              <h3 className="font-heading text-4xl sm:text-5xl font-light text-foreground mb-4">
                Spells Section
              </h3>

              <p className="font-mono text-base font-medium text-foreground leading-relaxed mb-6">
                This area will host custom AI spells, neural tools, and model experiments.
              </p>
            </div>

            <div className="pt-6 border-t-2 border-foreground/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 font-mono text-sm font-bold text-amber-700 bg-amber-50 border border-amber-300 px-4 py-2">
                <Clock className="h-4 w-4" /> Coming Soon
              </span>

              <Link
                href="/spells"
                className="inline-flex items-center justify-center gap-1.5 border-2 border-foreground bg-foreground text-white px-5 py-2 font-mono text-xs font-bold hover:opacity-90 transition-opacity"
              >
                View Spells Page <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column — Core AI Terminal Verification Quiz */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            className="border-2 border-foreground bg-white shadow-md"
          >
            <div className="flex items-center gap-2 border-b-2 border-foreground px-4 py-3 bg-secondary/80">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs font-bold text-foreground">core_ai_verification.sh</span>
            </div>
            <AIQuizGame />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
