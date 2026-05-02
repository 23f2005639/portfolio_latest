import { Suspense } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { AISkills } from "@/components/sections/AISkills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

function ProjectsSkeleton() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-3 w-24 animate-pulse rounded" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          <div className="flex-1 border-t border-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse border"
              style={{ backgroundColor: "rgba(13,21,32,0.7)", borderColor: "rgba(255,255,255,0.07)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <About />
      <AISkills />
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
      <Contact />
      <Footer />
    </main>
  );
}
