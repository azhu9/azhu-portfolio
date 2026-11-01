import { useEffect, useState } from "react";
import { VscGithubAlt } from "react-icons/vsc";
import { links } from "../data/content";
import ContributionCalendar from "./ContributionCalendar";

const USER = "azhu9";
const CACHE_KEY = "github-tile-v1";
const CACHE_MS = 60 * 60 * 1000; // GitHub allows 60 unauthenticated requests/hour per visitor

interface Repo {
  name: string;
  html_url: string;
  language: string | null;
  pushed_at: string;
}

interface GitHubData {
  repos: Repo[];
  publicRepos: number;
  followers: number;
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  "C++": "#F34B7D",
  HTML: "#E34C26",
  CSS: "#663399",
  Java: "#B07219",
  PHP: "#4F5D95",
};

function timeAgo(iso: string) {
  const minutes = (Date.now() - new Date(iso).getTime()) / 60000;
  const units: [number, string][] = [[60 * 24 * 365, "y"], [60 * 24 * 30, "mo"], [60 * 24, "d"], [60, "h"], [1, "m"]];
  for (const [size, label] of units) {
    if (minutes >= size) return `${Math.floor(minutes / size)}${label} ago`;
  }
  return "just now";
}

function readCache(): GitHubData | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    return cached && Date.now() - cached.at < CACHE_MS ? cached.data : null;
  } catch {
    return null;
  }
}

async function fetchGitHub(): Promise<GitHubData> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`),
    fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=10`),
  ]);
  if (!userRes.ok || !reposRes.ok) throw new Error("GitHub request failed");
  const user = await userRes.json();
  const repos: (Repo & { fork: boolean })[] = await reposRes.json();
  const data = {
    publicRepos: user.public_repos,
    followers: user.followers,
    repos: repos.filter((r) => !r.fork).slice(0, 3),
  };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // storage unavailable; we'll just fetch again next time
  }
  return data;
}

const GitHubTile = () => {
  const [data, setData] = useState<GitHubData | null>(readCache);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (data) return;
    fetchGitHub().then(setData, () => setFailed(true));
  }, [data]);

  return (
    <div className="tile flex flex-col justify-between gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-fg transition-colors hover:text-accent"
        >
          <VscGithubAlt className="text-2xl" />
          <span className="font-display text-xl font-bold">GitHub</span>
          <span className="text-sm text-muted">@{USER}</span>
        </a>
        {data && (
          <p className="text-xs text-muted">
            <span className="font-semibold text-fg">{data.publicRepos}</span> repos ·{" "}
            <span className="font-semibold text-fg">{data.followers}</span> followers
          </p>
        )}
      </div>

      <ContributionCalendar user={USER} />

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted">Recently pushed</p>
        {failed ? (
          <p className="text-sm text-muted">Couldn't reach GitHub right now. See everything on my profile.</p>
        ) : (
          <ul className="space-y-1">
            {(data?.repos ?? [null, null, null]).map((repo, i) =>
              repo ? (
                <li key={repo.name}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-line/10"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">{repo.name}</span>
                    {repo.language && (
                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: languageColors[repo.language] ?? "hsl(var(--muted))" }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="w-14 shrink-0 text-right text-xs text-muted">{timeAgo(repo.pushed_at)}</span>
                  </a>
                </li>
              ) : (
                <li key={i} className="h-8 animate-pulse rounded-lg bg-line/10" />
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GitHubTile;
