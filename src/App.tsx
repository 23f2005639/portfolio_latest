import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { ArrowDown, ArrowUpRight, FileText, GitHub, HuggingFace, Kaggle, LinkedIn, Mail, Palette } from "@/components/icons";

// WebGL glyphs load after the page: the name shows first, the glyphs fade in a moment later
const GlyphBackground = lazy(() => import("@/components/ui/backgrounds-glyph"));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// iOS Safari only has the video-specific fullscreen call
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
const fullscreen = (video: IOSVideo) => (video.requestFullscreen ? video.requestFullscreen().catch(() => {}) : video.webkitEnterFullscreen?.());

// plays only while on screen, fetched the first time it comes near; reduced motion gets poster + controls; tap for fullscreen
function Clip({ src, poster, label, ratio }: { src: string; poster: string; label: string; ratio: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || reduceMotion) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return video.pause();
      if (!video.getAttribute("src")) video.src = src;
      video.play().catch(() => {});
    }, { rootMargin: "200px" });
    io.observe(video);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      src={reduceMotion ? src : undefined}
      poster={poster}
      controls={reduceMotion}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      // with native controls (reduced motion) a click is play/pause, and the controls have their own fullscreen button
      title={reduceMotion ? undefined : "Tap or click for fullscreen"}
      onClick={reduceMotion ? undefined : (e) => fullscreen(e.currentTarget)}
      style={{ aspectRatio: ratio }}
      className={`mt-3 w-full border border-[var(--accent)] bg-black/40 object-cover ${reduceMotion ? "" : "cursor-zoom-in"}`}
    />
  );
}

const EMAIL = "mailto:namdeoshreyaslink@gmail.com"; // the address already printed on the public resume

const links = [
  { label: "Email", href: EMAIL, Icon: Mail },
  { label: "Resume", href: "/shreyas_namdeo_resume.pdf", Icon: FileText },
  { label: "GitHub", href: "https://github.com/23f2005639", Icon: GitHub },
  { label: "Kaggle", href: "https://www.kaggle.com/maxsn2005", Icon: Kaggle },
  { label: "Hugging Face", href: "https://huggingface.co/maxsn2200", Icon: HuggingFace },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shreyas-namdeo-2119b0290/", Icon: LinkedIn },
];

// icon + label; on small screens the header shows icons only (label stays for screen readers)
function Links({ name, iconOnlyOnPhone = false }: { name: string; iconOnlyOnPhone?: boolean }) {
  return (
    <nav aria-label={name} className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} className="group inline-flex min-h-6 min-w-6 items-center justify-center gap-1.5">
          <Icon className="size-4 shrink-0" />
          <span className={`underline-offset-4 group-hover:underline ${iconOnlyOnPhone ? "sr-only sm:not-sr-only" : ""}`}>{label}</span>
        </a>
      ))}
    </nav>
  );
}

// section headings in the resume's serif, in the palette's heading colour
const heading = "font-serif text-2xl font-bold text-heading";

// a project's colour pulled a quarter of the way to the palette's text, so small text stays readable on light and dark grounds
const ink = (c: string) => `color-mix(in oklab, ${c} 75%, var(--p-text))`;

// four colours each, in the order the CSS uses: background, lines, accent, text (index.css holds the named ones)
type Choice = { id: string; colors?: string[] };
declare global { interface Window { applyPalette: (c: Choice) => void } }
const PALETTES = [
  { id: "paper", name: "Paper", colors: ["#efe8dd", "#76abae", "#ff5722", "#303841"] },
  { id: "ocean", name: "Ocean", colors: ["#1b262c", "#0f4c75", "#3282b8", "#bbe1fa"] },
  { id: "dusk", name: "Dusk", colors: ["#0f3040", "#464858", "#a56f63", "#d99b7f"] },
];
const ROLES = ["Background", "Lines", "Accent", "Text"];

function PaletteSwitcher() {
  const [current, setCurrent] = useState(() => document.documentElement.dataset.palette ?? "paper");
  const [custom, setCustom] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("palette") ?? "null");
      if (saved?.id === "custom") return saved.colors;
    } catch { /* blocked or broken storage: start from Paper */ }
    return [...PALETTES[0].colors];
  });
  const choose = (c: Choice) => {
    window.applyPalette(c);
    setCurrent(c.id);
    try { localStorage.setItem("palette", JSON.stringify(c)); } catch { /* storage blocked: still applies for this visit */ }
  };
  return (
    <details className="fixed bottom-20 right-4 z-50 text-sm sm:right-8">
      <summary aria-label="Change colours" title="Change colours" className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-rule bg-background shadow-lg [&::-webkit-details-marker]:hidden">
        <Palette className="size-5" />
      </summary>
      <div className="absolute bottom-14 right-0 w-64 rounded-lg border border-rule bg-background p-3 shadow-xl">
        <p className="mb-2 font-serif text-lg font-bold text-heading">Colours</p>
        {PALETTES.map((p) => (
          <button key={p.id} type="button" aria-pressed={current === p.id} onClick={() => choose(p)} className="flex w-full items-center gap-3 rounded px-2 py-1.5 hover:bg-foreground/10 aria-pressed:bg-foreground/15">
            <span className="flex overflow-hidden rounded">{p.colors.map((c) => <span key={c} className="size-5" style={{ background: c }} />)}</span>
            {p.name}
          </button>
        ))}
        <p className="mb-1 mt-3 px-2">Your own</p>
        <div className="grid grid-cols-4 gap-2 px-2">
          {ROLES.map((role, i) => (
            <label key={role} className="flex flex-col items-center gap-1 text-[11px] text-muted">
              <input
                type="color"
                value={custom[i]}
                onChange={(e) => {
                  const next = custom.map((c, j) => (j === i ? e.target.value : c));
                  setCustom(next);
                  choose({ id: "custom", colors: next });
                }}
                className="h-8 w-full cursor-pointer rounded border border-rule bg-transparent"
              />
              {role}
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}

// fade content up as it scrolls into view; reduced motion shows everything at once
function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduceMotion) return items.forEach((el) => el.setAttribute("data-shown", ""));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-shown", "");
        io.unobserve(e.target);
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

type Project = {
  name: string;
  href: string;
  text: string;
  stat: string;
  caption: string;
  tags: string;
  clip?: { src: string; poster: string; label: string; ratio: string };
  accent: string; // the project's own colour, taken from its clip
  ramp?: string[]; // colour stops for the big number (BPIP's heat ramp)
};

const work: Project[] = [
  {
    name: "GUPTCHARA",
    href: "https://github.com/23f2005639/LWB-Exv2",
    text: "A privacy agent that hides faces and private info on screen before an AI agent gets to see it. I designed the agent's architecture and built the custom YOLO model behind the detection.",
    stat: "~92%",
    caption: "custom YOLO accuracy",
    tags: "Custom YOLO · agent architecture · Smart India Hackathon, ISRO PS-171",
    accent: "#f5a623", // the orange of its redaction boxes
    clip: { src: "/guptchara-color.mp4", poster: "/guptchara-color.jpg", ratio: "960 / 478", label: "GUPTCHARA blacking out a face, card numbers and passwords on a demo profile page before the AI agent reads it" },
  },
  {
    name: "PlanTo3D",
    href: "https://github.com/23f2005639/planTo3D",
    text: "Drop in a floor plan PDF and get a furnished 3D house you can walk through in the browser. No AI model, no LLM, just geometry, rules and Blender.",
    stat: "~1.5 min",
    caption: "PDF to walkable house",
    clip: { src: "/planto3d-color.mp4", poster: "/planto3d-color.jpg", ratio: "960 / 574", label: "PlanTo3D walkthrough of a house built from a sample floor plan" },
    tags: "Python · Blender · three.js · Poppler",
    accent: "#e3a869", // the wood of the walkthrough
  },
  {
    name: "Container Security",
    href: "https://github.com/23f2005639/Docker_Security_Agent",
    text: "Runs five real attacks against three deliberately weak containers, then four AI agents work out what happened and write a report.",
    stat: "5 attacks",
    caption: "on 3 weak containers",
    tags: "Python · Docker · eBPF · multi-agent",
    accent: "#ff5a4e", // the attack red in its film
    clip: { src: "/container.mp4", poster: "/container.jpg", ratio: "16 / 9", label: "Explainer: an attacker runs five real attacks on a sandbox of containers and the host, then the scanner, monitor and network agents run together and the reporter writes a report" },
  },
  {
    name: "Parking hotspots",
    href: "https://github.com/23f2005639/parking_violation_system",
    text: "Predicts where illegal parking piles up across 7,814 zones in Bengaluru, so enforcement knows where to go.",
    stat: "2.83",
    caption: "validation RMSE",
    tags: "PyTorch · FastAPI · React · Poisson loss",
    accent: "#ff9f1c",
    ramp: ["#3a6fd8", "#ffd60a", "#ff9f1c", "#ff4d4d"], // its severity ramp, low to critical
    clip: { src: "/parking.mp4", poster: "/parking.jpg", ratio: "16 / 9", label: "Explainer: each city grid cell gets a learned embedding plus time inputs, a network predicts violations per hour, then a day plays through with peak hours tripling the impact and patrols sent to the top hotspots" },
  },
];

const about = [
  ["Now", "Exploring how reasoning models actually work. Also researching how LLMs can be used for compression, and open world models."],
  ["2023–27", "B.Sc. Data Science, IIT Madras. GPA 8.23."],
  ["2023–28", "Integrated MCA, IIPS DAVV. Yes, two degrees at once."],
  ["2026–now", "Co-organizer at GDSC IIPS DAVV."],
  ["2025–26", "AI/ML lead at GDSC IIPS DAVV. Ran workshops, helped teams get hackathon builds working."],
  ["Jan 2026", "NVIDIA certificate, AI for anomaly detection."],
];

const stack = [
  ["Languages & ML", ["Python", "PyTorch", "TypeScript", "NumPy & Pandas", "HF Transformers", "LangChain", "LangGraph", "FastAPI"]],
  ["Vision & agents", ["YOLO", "Agent architecture", "Multi-agent systems", "RAG, FAISS, Chroma", "Small language models"]],
  ["Infra & tools", ["Docker", "Linux", "Blender", "Bash", "n8n"]],
] as const;

function FooterContent(): ReactNode {
  return (
    <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-20 text-foreground sm:px-6 sm:pt-28">
      <p className="font-serif text-2xl font-bold text-heading">Contact</p>
      <h2 className="mt-4 max-w-[14ch] text-balance text-4xl font-bold leading-[0.95] tracking-tighter sm:text-7xl">
        Got a model that won't converge?{" "}
        <a href={EMAIL} className="underline decoration-2 underline-offset-[6px] hover:decoration-4">
          Say hi.
        </a>
      </h2>
      <div className="mt-10 text-base">
        <Links name="Footer links" />
      </div>
      <div className="mt-20 flex flex-wrap justify-between gap-3 border-t border-rule pt-5 text-xs text-muted sm:mt-28">
        <span>Shreyas Namdeo, 2026</span>
        <span>Move or tap around here.</span>
      </div>
    </div>
  );
}

export default function App() {
  useReveal();
  return (
    <>
      <GlyphPortal
        word="SHREYAS"
        enterLabel="Skip"
        // the name is filled with the palette's accent; the glyphs inside it take the palette's glow colour
        style={{ "--gp-paper": "var(--p-bg)", "--gp-ink": "var(--p-text)", "--gp-field": "var(--p-accent)", "--gp-foreground": "#fff", fontFamily: "inherit" }}
        background={<Suspense fallback={null}><GlyphBackground className="absolute inset-0 text-[var(--p-glow)]" interactive={false} haze={0.95} /></Suspense>}
        front={
          <>
            <header className="enter absolute inset-x-4 top-5 flex justify-end text-sm [--d:700ms] sm:inset-x-8 sm:top-7">
              <Links name="Links" iconOnlyOnPhone />
            </header>
            <p className="enter absolute inset-x-4 bottom-[calc(100%_-_var(--gp-word-top,35%)_+_18px)] text-center [--d:250ms] text-xs uppercase tracking-[0.2em]">
              AI / ML engineer · India
            </p>
            <p className="enter absolute inset-x-4 top-[calc(var(--gp-word-bottom,50%)_+_18px)] mx-auto [--d:450ms] max-w-[30ch] text-balance text-center text-base sm:text-xl">
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
        <section id="work" className="border-t border-rule py-14">
          <h2 data-reveal className={`mb-6 ${heading}`}>Work</h2>
          <ul className="divide-y divide-rule">
            {work.map((p, i) => (
              <li
                key={p.name}
                data-reveal
                style={{ "--accent": p.accent } as CSSProperties}
                className="group/row relative isolate grid gap-x-6 gap-y-2 py-8 before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-[var(--accent)] before:opacity-0 before:transition-opacity hover:before:opacity-[0.09] sm:grid-cols-[3rem_1fr_11rem]"
              >
                <span className="font-mono text-sm" style={{ color: ink(p.accent) }}>0{i + 1}</span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <a href={p.href} className="group inline-flex items-center gap-2 underline-offset-4 hover:underline">
                      {p.name}
                      <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </h3>
                  <p className="mt-2 max-w-prose">{p.text}</p>
                  <p className="mt-3 font-mono text-xs text-muted">{p.tags}</p>
                  <a href={p.href} className="mt-2 inline-flex items-center gap-1.5 break-all font-mono text-xs underline underline-offset-4 hover:decoration-2" style={{ color: ink(p.accent) }}>
                    <GitHub className="size-3.5 shrink-0" />
                    {p.href.replace("https://", "")}
                    <ArrowUpRight className="size-3 shrink-0" />
                  </a>
                </div>
                <p className="sm:text-right">
                  <span className="inline-block bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl" style={{ backgroundImage: `linear-gradient(90deg, ${(p.ramp ?? [p.accent, p.accent]).map(ink).join(", ")})` }}>
                    {p.stat}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{p.caption}</span>
                </p>
                {/* clips span the text and number columns so the small labels in them stay readable */}
                {p.clip && <div className="sm:col-span-2 sm:col-start-2"><Clip {...p.clip} /></div>}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-rule py-14">
          <h2 data-reveal className={`mb-6 ${heading}`}>About</h2>
          <dl data-reveal className="grid gap-x-8 gap-y-3 sm:grid-cols-[6rem_1fr]">
            {about.map(([when, what]) => (
              <div key={when} className="contents">
                <dt className="font-mono text-sm text-muted sm:pt-0.5">{when}</dt>
                <dd className="mb-3 sm:mb-0">{what}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-rule py-14">
          <h2 data-reveal className={`mb-6 ${heading}`}>Stack</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {stack.map(([group, items], i) => (
              <div key={group} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                <h3 className="border-b border-rule pb-2 text-sm font-bold">{group}</h3>
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

      <footer className="bg-[var(--p-footer)] text-foreground">
        <Suspense fallback={<FooterContent />}>
          <GlyphBackground className="text-[var(--p-glow)]" haze={0.6}>
            <FooterContent />
          </GlyphBackground>
        </Suspense>
      </footer>
      <PaletteSwitcher />
    </>
  );
}
