import { Octokit } from "@octokit/rest";
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

export function getLanguageColor(language: string | null): string {
  if (!language) return "#8b949e";
  return LANGUAGE_COLORS[language] ?? "#8b949e";
}

export async function getRepos(): Promise<GithubRepo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-repos");

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const { data } = await octokit.repos.listForUser({
      username: "23f2005639",
      type: "owner",
      per_page: 100,
      sort: "updated",
    });

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
  } catch {
    return [];
  }
}
