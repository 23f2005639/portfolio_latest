import { GlyphBackground } from "@/components/ui/backgrounds-glyph";
import GlyphPortal from "@/components/ui/glyph-portal";
import { ArrowDown, ArrowUpRight, FileText, GitHub, LinkedIn } from "@/components/icons";

const links = [
  { label: "Resume", href: "/shreyas_namdeo_resume.pdf", Icon: FileText },
  { label: "GitHub", href: "https://github.com/23f2005639", Icon: GitHub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shreyas-namdeo-2119b0290/", Icon: LinkedIn },
];

// icon + label; on small screens the header shows icons only (label stays for screen readers)
function Links({ iconOnlyOnPhone = false }: { iconOnlyOnPhone?: boolean }) {
  return (
    <nav className="flex items-center gap-4 sm:gap-5">
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} className="group inline-flex min-h-6 min-w-6 items-center justify-center gap-1.5">
          <Icon className="size-4 shrink-0" />
          <span className={`underline-offset-4 group-hover:underline ${iconOnlyOnPhone ? "sr-only sm:not-sr-only" : ""}`}>{label}</span>
        </a>
      ))}
    </nav>
  );
}

const label = "text-xs uppercase tracking-[0.2em] text-neutral-600";

const work = [
  {
    name: "GUPTCHARA",
    href: "https://github.com/23f2005639/LWB-Exv2",
    text: "A privacy agent that hides faces and private info on screen before an AI agent gets to see it. I designed the agent's architecture and built the custom YOLO model behind the detection.",
    stat: "~92%",
    caption: "custom YOLO accuracy",
    tags: "Custom YOLO · agent architecture · Smart India Hackathon, ISRO PS-171",
  },
  {
    name: "PlanTo3D",
    href: "https://github.com/23f2005639/planTo3D",
    text: "Drop in a floor plan PDF and get a furnished 3D house you can walk through in the browser. No AI model, no LLM, just geometry, rules and Blender.",
    stat: "~1.5 min",
    caption: "PDF to walkable house",
    tags: "Python · Blender · three.js · Poppler",
  },
  {
    name: "Container Security",
    href: "https://github.com/23f2005639",
    text: "Runs five real container attacks across three sandboxes while four AI agents try to catch and stop them.",
    stat: "5 attacks",
    caption: "across 3 sandboxes",
    tags: "Python · Docker · eBPF · multi-agent",
  },
  {
    name: "Parking hotspots",
    href: "https://github.com/23f2005639",
    text: "Predicts where illegal parking piles up across 7,814 zones in Bengaluru, so enforcement knows where to go.",
    stat: "2.83",
    caption: "validation RMSE",
    tags: "PyTorch · FastAPI · React · Poisson loss",
  },
];

const about = [
  ["2023–27", "B.Sc. Data Science, IIT Madras. GPA 8.23."],
  ["2023–28", "Integrated MCA, IIPS DAVV. Yes, two degrees at once."],
  ["2025–26", "AI/ML lead at GDSC IIPS DAVV. Ran workshops, helped teams get hackathon builds working."],
  ["Jan 2026", "NVIDIA certificate, AI for anomaly detection."],
];

const stack = [
  ["Languages & ML", ["Python", "PyTorch", "TypeScript", "NumPy & Pandas", "HF Transformers", "LangChain", "LangGraph", "FastAPI"]],
  ["Vision & agents", ["YOLO", "Agent architecture", "Multi-agent systems", "RAG, FAISS, Chroma", "Small language models"]],
  ["Infra & tools", ["Docker", "Linux", "Blender", "Bash", "n8n"]],
] as const;

export default function App() {
  return (
    <>
      <GlyphPortal
        word="SHREYAS"
        enterLabel="Skip"
        style={{ "--gp-paper": "#fff", "--gp-ink": "#000", "--gp-field": "#000", "--gp-foreground": "#fff", fontFamily: "inherit" }}
        background={<GlyphBackground className="absolute inset-0 text-white" interactive={false} haze={0.55} />}
        front={
          <>
            <header className="absolute inset-x-4 top-5 flex flex-wrap items-center justify-between gap-3 text-sm sm:inset-x-8 sm:top-7">
              <span className="font-bold">Shreyas Namdeo</span>
              <Links iconOnlyOnPhone />
            </header>
            <p className="absolute inset-x-4 bottom-[calc(100%_-_var(--gp-word-top,35%)_+_18px)] text-center text-xs uppercase tracking-[0.2em]">
              AI / ML engineer · India
            </p>
            <p className="absolute inset-x-4 top-[calc(var(--gp-word-bottom,50%)_+_18px)] mx-auto max-w-[30ch] text-balance text-center text-base sm:text-xl">
              Usually one git commit away from fixing the loss curve.
            </p>
          </>
        }
      >
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-4xl font-bold leading-[0.95] tracking-tighter sm:text-6xl">Hi, I'm Shreyas.</h2>
          <p className="mt-6 max-w-xl text-lg sm:text-xl">
            I build ML stuff. Mostly vision models and AI agents. Doing data science at IIT Madras and an MCA at DAVV at
            the same time.
          </p>
          <a href="#work" className="mt-8 inline-flex items-center gap-2 underline underline-offset-4">
            See the work <ArrowDown className="size-4" />
          </a>
        </div>
      </GlyphPortal>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <section id="work" className="border-t border-black py-14">
          <h2 className={`mb-6 ${label}`}>Work</h2>
          <ul className="divide-y divide-black">
            {work.map((p, i) => (
              <li
                key={p.name}
                className="group/row relative isolate grid gap-x-6 gap-y-2 py-8 transition-colors before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-black before:opacity-0 before:transition-opacity hover:text-white hover:before:opacity-100 sm:grid-cols-[3rem_1fr_11rem]"
              >
                <span className="font-mono text-sm text-neutral-600 group-hover/row:text-neutral-400">0{i + 1}</span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <a href={p.href} className="group inline-flex items-center gap-2 underline-offset-4 hover:underline">
                      {p.name}
                      <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </h3>
                  <p className="mt-2 max-w-prose">{p.text}</p>
                  <p className="mt-3 font-mono text-xs text-neutral-600 group-hover/row:text-neutral-400">{p.tags}</p>
                </div>
                <p className="sm:text-right">
                  <span className="block text-3xl font-bold tracking-tight sm:text-4xl">{p.stat}</span>
                  <span className="mt-1 block text-sm text-neutral-600 group-hover/row:text-neutral-400">{p.caption}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-black py-14">
          <h2 className={`mb-6 ${label}`}>About</h2>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[6rem_1fr]">
            {about.map(([when, what]) => (
              <div key={when} className="contents">
                <dt className="font-mono text-sm text-neutral-600 sm:pt-0.5">{when}</dt>
                <dd className="mb-3 sm:mb-0">{what}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-black py-14">
          <h2 className={`mb-6 ${label}`}>Stack</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {stack.map(([group, items]) => (
              <div key={group}>
                <h3 className="border-b border-black pb-2 text-sm font-bold">{group}</h3>
                <ul className="mt-3 space-y-1.5">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="bg-black text-white">
        <GlyphBackground className="text-white" haze={0.6}>
          <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-20 sm:px-6 sm:pt-28">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Contact</p>
            <h2 className="mt-4 max-w-[14ch] text-balance text-4xl font-bold leading-[0.95] tracking-tighter sm:text-7xl">
              Got a model that won't converge? Say hi.
            </h2>
            <div className="mt-10 text-base">
              <Links />
            </div>
            <div className="mt-20 flex flex-wrap justify-between gap-3 border-t border-white/30 pt-5 text-xs text-neutral-400 sm:mt-28">
              <span>Shreyas Namdeo, 2026</span>
              <span>Move or tap around here.</span>
            </div>
          </div>
        </GlyphBackground>
      </footer>
    </>
  );
}
