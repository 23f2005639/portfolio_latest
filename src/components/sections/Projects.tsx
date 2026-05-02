import { getRepos, getLanguageColor, type GithubRepo } from "@/lib/github";
import { ArrowUpRight, Star } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ProjectTile({ repo }: { repo: GithubRepo }) {
  return (
    <div className={`project-tile group relative flex flex-col bg-white border p-5 min-h-[180px]${repo.isFeatured ? " featured" : ""}`}>
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {repo.isFeatured && (
            <span className="bg-foreground font-mono text-[9px] px-1.5 py-0.5 text-white uppercase tracking-widest">
              featured
            </span>
          )}
          {repo.language && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <Star className="h-2.5 w-2.5" />
              {repo.stargazers_count}
            </span>
          )}
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${repo.name} on GitHub`}
          className="shrink-0 text-muted-foreground/40 transition-colors duration-150 group-hover:text-foreground"
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Name */}
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 font-mono text-sm font-medium text-foreground break-all leading-snug hover:underline"
      >
        {repo.name}
      </a>

      {/* Description */}
      <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
        {repo.description || "No description provided."}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="font-mono text-[10px] text-muted-foreground/60 border border-border px-1.5 py-0.5"
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
          className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Live demo"
        >
          live demo <ArrowUpRight className="h-2.5 w-2.5" />
        </a>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center border border-dashed border-border py-20 text-center">
      <GithubIcon className="mb-4 h-8 w-8 text-muted-foreground/30" />
      <p className="font-mono text-sm text-muted-foreground">No public repos found</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground/50">
        Projects appear here once pushed to GitHub.
      </p>
    </div>
  );
}

export async function Projects() {
  const repos = await getRepos();

  return (
    <section id="projects" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-12 flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-muted-foreground">
            [PROJECTS]
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="font-mono text-xs text-muted-foreground/50">
            {repos.length} repos
          </span>
        </div>

        {repos.length === 0 ? (
          <div className="grid"><EmptyState /></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <ProjectTile key={repo.name} repo={repo} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
