import { cacheLife, cacheTag } from "next/cache";
import { projectsConfig } from "@/data/projects-config";

export interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
  isFeatured: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
};

export function getLanguageColor(_language: string | null): string {
  return "#0a0a0a";
}

interface GitHubApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  updated_at: string | null;
  fork: boolean;
  archived: boolean;
}

export async function getRepos(): Promise<GithubRepo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-repos");

  try {
    // Use the public GitHub REST API — no token required
    const response = await fetch(
      "https://api.github.com/users/23f2005639/repos?type=owner&per_page=100&sort=updated",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return [];
    }

    const data: GitHubApiRepo[] = await response.json();

    const filtered = data.filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        !projectsConfig.hiddenRepos.includes(repo.name)
    );

    const mapped: GithubRepo[] = filtered.map((repo) => {
      const override = projectsConfig.overrides[repo.name];
      return {
        name: repo.name,
        description: override?.description ?? repo.description ?? "",
        html_url: repo.html_url,
        homepage: override?.liveUrl ?? repo.homepage ?? null,
        language: repo.language ?? null,
        stargazers_count: repo.stargazers_count ?? 0,
        topics: override?.tags ?? repo.topics ?? [],
        updated_at: repo.updated_at ?? new Date().toISOString(),
        isFeatured: projectsConfig.featuredRepos.includes(repo.name),
      };
    });

    return mapped.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.stargazers_count - a.stargazers_count;
    });
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}
