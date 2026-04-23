// Edit this file to control which GitHub repos appear on the portfolio.
//
// hiddenRepos   — repo names to hide (forks + archived are already hidden automatically)
// featuredRepos — shown first and styled with an animated border
// overrides     — replace GitHub's metadata per repo
export const projectsConfig = {
  hiddenRepos: [] as string[],

  featuredRepos: [] as string[],

  overrides: {} as Record<
    string,
    {
      description?: string;
      liveUrl?: string;
      tags?: string[];
    }
  >,
};
