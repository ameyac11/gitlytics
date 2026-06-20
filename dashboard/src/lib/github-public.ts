// Copyright (c) 2024 Ameya Chopade. Licensed under Apache-2.0 with Commons Clause.
// Commercial use and cloud deployment as a service are strictly prohibited.
// See LICENSE.md for full terms.
import { API_BASE, type RepoTraffic } from "./github-api";

export interface PublicProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface PublicRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  open_issues_count: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  default_branch: string;
  total_commits?: number | null;
  open_prs?: number | null;
  total_releases?: number | null;
  last_release_at?: string | null;
  has_readme?: boolean | null;
  has_license?: boolean | null;
  has_contributing?: boolean | null;
  has_code_of_conduct?: boolean | null;
}

export interface UsernamePayload {
  profile: PublicProfile;
  repos: PublicRepo[];
}

/**
 * Fetch profile + repos for a username through the FastAPI backend.
 * Backend endpoint contract (mirrors Live API mode):
 *   POST {API_BASE}/api/username  body: { username }
 *   → { profile: PublicProfile, repos: PublicRepo[] }
 */
export async function fetchUsernamePayload(username: string): Promise<UsernamePayload> {
  const res = await fetch(`${API_BASE}/api/username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (res.status === 404) throw new Error("User not found.");
  if (res.status === 403) throw new Error("GitHub rate-limit reached. Try again later.");
  if (!res.ok) {
    throw new Error(
      `Failed to load profile (${res.status}). Make sure the backend is running.`,
    );
  }
  return (await res.json()) as UsernamePayload;
}

// Back-compat helpers (kept thin so other call sites keep working).
export async function fetchUser(username: string): Promise<PublicProfile> {
  const { profile } = await fetchUsernamePayload(username);
  return profile;
}

export async function fetchUserRepos(username: string): Promise<PublicRepo[]> {
  const { repos } = await fetchUsernamePayload(username);
  return repos;
}

/**
 * Synthesise a RepoTraffic-shaped record from a public repo so all existing
 * dashboard components keep working. Traffic-specific fields are zeroed out
 * (locked behind PAT mode).
 */
export function publicReposToTraffic(repos: PublicRepo[]): RepoTraffic[] {
  return repos.map((r) => ({
    repository: r.full_name,
    is_private: false,
    stars: r.stargazers_count,
    forks: r.forks_count,
    "views": 0,
    "unique_visitors": 0,
    "clones": 0,
    "unique_cloners": 0,
    "top_referrer": "",
    // Real metadata from the public GitHub API
    language: r.language ?? null,
    topics: r.topics ?? [],
    watchers_count: r.watchers_count,
    open_issues_count: r.open_issues_count,
    pushed_at: r.pushed_at,
    created_at: r.created_at,
    total_commits: r.total_commits ?? null,
    open_prs: r.open_prs ?? null,
    total_releases: r.total_releases ?? null,
    last_release_at: r.last_release_at ?? null,
    has_readme: r.has_readme ?? null,
    has_license: r.has_license ?? null,
    has_contributing: r.has_contributing ?? null,
    has_code_of_conduct: r.has_code_of_conduct ?? null,
    _daily_views: [],
    _daily_clones: [],
    _referrers: [],
    _paths: [],
  }));
}
