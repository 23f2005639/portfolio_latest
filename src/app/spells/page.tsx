import Link from "next/link";
import { ArrowLeft, Clock, Terminal } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export default function SpellsPage() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      <Nav />

      <div className="pt-28 pb-20 mx-auto max-w-6xl px-6">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm font-bold text-foreground hover:text-foreground/70 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b-2 border-foreground pb-8 mb-12">
          <div className="inline-flex items-center gap-2 border-2 border-foreground px-3.5 py-1.5 font-mono text-xs font-bold mb-4 bg-secondary">
            {/* Vibrant dots */}
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="ml-1 uppercase tracking-wider">SPELLS REGISTRY</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl font-light text-foreground mb-4">
            Spells
          </h1>
          <p className="font-mono text-base font-medium text-foreground leading-relaxed max-w-2xl">
            Custom AI models, neural experiments, and interactive spell tools will be released here.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="border-2 border-foreground bg-white p-8 md:p-12 shadow-md relative">
          <div className="flex items-center justify-between mb-6 border-b-2 border-foreground/20 pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              // SECTION_STATUS
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-3.5 py-1.5">
              <Clock className="h-4 w-4" /> Coming Soon
            </span>
          </div>

          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Spells Will Update Soon
          </h2>

          <p className="font-mono text-base font-medium text-foreground leading-relaxed max-w-xl mb-8">
            This page is reserved for live AI spells, PyTorch model checkpoints, and interactive demonstrations. Content will be added as new spells are published.
          </p>

          <div className="border-2 border-foreground bg-secondary/50 p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-2 text-foreground font-bold">
              <Terminal className="h-4 w-4" />
              <span>STATUS_LOG.sh</span>
            </div>
            <p className="text-foreground font-medium leading-relaxed">
              &gt; Status: In development. Demos and documentation will be deployed here soon.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
