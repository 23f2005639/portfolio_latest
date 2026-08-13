import { getRepos, type GithubRepo } from "@/lib/github";
import { ArrowUpRight, Star } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ProjectTile({ repo }: { repo: GithubRepo }) {
  // Vibrant status dot selection
  const dotColor =
    repo.language === "Python"
      ? "bg-emerald-500"
      : repo.language === "TypeScript" || repo.language === "JavaScript"
      ? "bg-cyan-500"
      : repo.language === "C++" || repo.language === "Go"
      ? "bg-violet-500"
      : "bg-amber-500";

  return (
    <div className={`project-tile group relative flex flex-col bg-white border-2 border-foreground p-6 min-h-[200px] shadow-xs hover:shadow-md transition-shadow${repo.isFeatured ? " featured" : ""}`}>
      {/* Top row */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {repo.isFeatured && (
            <span className="bg-foreground font-mono text-[10px] font-bold px-2 py-0.5 text-white uppercase tracking-wider">
              featured
            </span>
          )}
          {repo.language && (
            <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground bg-secondary px-2.5 py-1 border border-foreground/30">
              {/* Vibrant Colored Dot */}
              <span className={`h-2.5 w-2.5 rounded-full ${dotColor} animate-pulse`} />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
              <Star className="h-3 w-3 fill-foreground/10" />
              {repo.stargazers_count}
            </span>
          )}
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${repo.name} on GitHub`}
          className="shrink-0 text-foreground transition-transform duration-150 group-hover:scale-110"
        >
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </div>

      {/* Name */}
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 font-mono text-base font-bold text-foreground break-all leading-snug hover:underline"
      >
        {repo.name}
      </a>

      {/* Description */}
      <p className="flex-1 font-mono text-sm leading-relaxed text-foreground/90 font-medium line-clamp-3">
        {repo.description || "Core AI repository."}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="font-mono text-xs font-semibold text-foreground border border-foreground/40 bg-secondary/50 px-2 py-0.5"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Live link */}
      {repo.homepage && (
        <a
          href={repo.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-bold text-foreground hover:underline transition-colors"
          aria-label="Live demo"
        >
          live demo <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center border-2 border-dashed border-foreground py-20 text-center">
      <GithubIcon className="mb-4 h-10 w-10 text-foreground" />
      <p className="font-mono text-base font-bold text-foreground">No public repos found</p>
      <p className="mt-1 font-mono text-xs font-medium text-foreground">
        Projects appear here once pushed to GitHub.
      </p>
    </div>
  );
}

export async function Projects() {
  const repos = await getRepos();

  return (
    <section id="projects" className="bg-white py-24 md:py-32 border-t-2 border-border">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-foreground">
            [PROJECTS]
          </span>

          {/* VIBRANT COLORED DOTS IN PROJECTS SECTION HEADER */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="flex-1 border-t-2 border-foreground/30" />
          <span className="font-mono text-xs font-bold text-foreground">
            {repos.length} repos
          </span>
        </div>

        {repos.length === 0 ? (
          <div className="grid"><EmptyState /></div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <ProjectTile key={repo.name} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
