import type { RepoTraffic } from "./github-api";

function days(base: number, jitter: number, n = 14, isClones = false, repoIndex = 0) {
  const out: { timestamp: string; count: number; uniques: number }[] = [];
  const start = new Date("2024-10-01T00:00:00Z");
  const patterns: Record<number, { views: number[]; clones: number[] }> = {
    0: {
      views: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 1.2, 1.5, 0.8, 0.6, 1.0, 1.1],
      clones: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 1.5, 1.8, 0.6, 0.7, 1.3, 0.5]
    },
    1: {
      views: [1.8, 1.9, 0.5, 0.4, 1.7, 1.8, 1.9, 1.8, 0.5, 0.4, 1.7, 1.9, 2.0, 0.5],
      clones: [1.5, 1.6, 0.4, 0.3, 1.4, 1.5, 1.6, 1.5, 0.4, 0.3, 1.4, 1.6, 1.7, 0.4]
    },
    2: {
      views: [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.0],
      clones: [0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.4, 1.5, 1.8]
    },
    3: {
      views: [0.8, 0.9, 0.7, 1.0, 0.9, 0.8, 0.7, 0.9, 0.8, 0.9, 1.0, 1.1, 1.0, 4.0],
      clones: [0.7, 0.8, 0.6, 0.9, 0.8, 0.7, 0.6, 0.8, 0.7, 0.8, 0.9, 1.0, 0.9, 3.2]
    },
    4: {
      views: [2.2, 2.0, 1.8, 1.6, 1.4, 1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3],
      clones: [2.0, 1.8, 1.6, 1.4, 1.3, 1.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]
    },
    5: {
      views: [1.0, 0.5, 2.2, 0.3, 1.8, 0.6, 1.4, 0.4, 2.0, 0.8, 1.2, 0.5, 1.7, 1.0],
      clones: [0.9, 0.4, 1.8, 0.3, 1.5, 0.5, 1.2, 0.3, 1.7, 0.7, 1.0, 0.4, 1.4, 0.9]
    }
  };
  const p = patterns[repoIndex] || patterns[0];
  const multipliers = isClones ? p.clones : p.views;
  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const m = multipliers[i % multipliers.length];
    const noise = 1 + (Math.random() - 0.5) * 0.15;
    const count = Math.max(0, Math.round(base * m * noise));
    out.push({
      timestamp: d.toISOString(),
      count,
      uniques: Math.max(0, Math.round(count * (0.55 + Math.random() * 0.15))),
    });
  }
  return out;
}

export const DEMO_DATA: RepoTraffic[] = [
  {
    repository: "ameyac11/gitlytics",
    is_private: false,
    stars: 412,
    forks: 58,
    "views": 8420,
    "unique_visitors": 5120,
    "clones": 940,
    "unique_cloners": 610,
    "top_referrer": "google.com",
    "top_referrer_views": 1820,
    "top_path": "/tree/main/docs",
    "top_path_views": 940,
    "fetched_at": "2024-10-15 12:00 UTC",
    language: "TypeScript",
    topics: ["analytics", "github", "react"],
    watchers_count: 412,
    open_issues_count: 14,
    open_prs: 3,
    total_commits: 1205,
    total_releases: 12,
    last_release_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    pushed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: "2023-01-10T10:00:00Z",
    has_readme: true,
    has_license: true,
    has_contributing: true,
    has_code_of_conduct: true,
    _daily_views: days(560, 180, 14, false, 0),
    _daily_clones: days(380, 30, 14, true, 0),
    _referrers: [
      { referrer: "google.com", count: 1820, uniques: 1240 },
      { referrer: "github.com", count: 1110, uniques: 880 },
      { referrer: "reddit.com", count: 640, uniques: 510 },
      { referrer: "news.ycombinator.com", count: 420, uniques: 360 },
      { referrer: "twitter.com", count: 280, uniques: 240 },
    ],
    _paths: [
      { path: "/tree/main/docs", title: "Documentation", count: 940, uniques: 720 },
      { path: "/", title: "gitlytics", count: 820, uniques: 640 },
      { path: "/blob/main/README.md", title: "README", count: 510, uniques: 420 },
      { path: "/releases", title: "Releases", count: 290, uniques: 230 },
    ],
  },
  {
    repository: "ameyac11/gilytics-github-traffic-automation",
    is_private: false,
    stars: 248,
    forks: 31,
    "views": 5230,
    "unique_visitors": 3140,
    "clones": 610,
    "unique_cloners": 390,
    "top_referrer": "github.com",
    "top_referrer_views": 980,
    "top_path": "/",
    "top_path_views": 720,
    "fetched_at": "2024-10-15 12:00 UTC",
    language: "Python",
    topics: ["cli", "terminal", "tooling"],
    watchers_count: 248,
    open_issues_count: 8,
    open_prs: 1,
    total_commits: 432,
    total_releases: 5,
    last_release_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    pushed_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: "2023-05-12T10:00:00Z",
    has_readme: true,
    has_license: true,
    has_contributing: false,
    has_code_of_conduct: false,
    _daily_views: days(340, 120, 14, false, 1),
    _daily_clones: days(40, 18, 14, true, 1),
    _referrers: [
      { referrer: "github.com", count: 980, uniques: 760 },
      { referrer: "google.com", count: 720, uniques: 540 },
      { referrer: "dev.to", count: 310, uniques: 260 },
    ],
    _paths: [
      { path: "/", title: "gilytics-github-traffic-automation", count: 720, uniques: 560 },
      { path: "/wiki", title: "Wiki", count: 340, uniques: 280 },
    ],
  },
  {
    repository: "ameyac11/data-pipeline",
    is_private: true,
    stars: 96,
    forks: 12,
    "views": 2870,
    "unique_visitors": 1680,
    "clones": 320,
    "unique_cloners": 210,
    "top_referrer": "google.com",
    "top_referrer_views": 540,
    "top_path": "/tree/main/src",
    "top_path_views": 410,
    "fetched_at": "2024-10-15 12:00 UTC",
    language: "Go",
    topics: ["data", "etl", "pipeline"],
    watchers_count: 96,
    open_issues_count: 2,
    open_prs: 0,
    total_commits: 850,
    total_releases: 0,
    last_release_at: null,
    pushed_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    created_at: "2023-08-20T10:00:00Z",
    has_readme: true,
    has_license: false,
    has_contributing: false,
    has_code_of_conduct: false,
    _daily_views: days(190, 70, 14, false, 2),
    _daily_clones: days(21, 10, 14, true, 2),
    _referrers: [
      { referrer: "google.com", count: 540, uniques: 420 },
      { referrer: "github.com", count: 380, uniques: 300 },
    ],
    _paths: [{ path: "/tree/main/src", title: "Source", count: 410, uniques: 320 }],
  },
  {
    repository: "ameyac11/portfolio-site",
    is_private: false,
    stars: 64,
    forks: 9,
    "views": 1940,
    "unique_visitors": 1210,
    "clones": 140,
    "unique_cloners": 95,
    "top_referrer": "linkedin.com",
    "top_referrer_views": 410,
    "top_path": "/",
    "top_path_views": 380,
    "fetched_at": "2024-10-15 12:00 UTC",
    language: "TypeScript",
    topics: ["portfolio", "react", "nextjs"],
    watchers_count: 64,
    open_issues_count: 0,
    open_prs: 0,
    total_commits: 120,
    total_releases: null,
    last_release_at: null,
    pushed_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    created_at: "2022-11-05T10:00:00Z",
    has_readme: true,
    has_license: true,
    has_contributing: false,
    has_code_of_conduct: false,
    _daily_views: days(130, 50, 14, false, 3),
    _daily_clones: days(9, 5, 14, true, 3),
    _referrers: [
      { referrer: "linkedin.com", count: 410, uniques: 340 },
      { referrer: "google.com", count: 290, uniques: 230 },
    ],
    _paths: [{ path: "/", title: "portfolio-site", count: 380, uniques: 300 }],
  },
  {
    repository: "ameyac11/ml-experiments",
    is_private: false,
    stars: 38,
    forks: 6,
    "views": 1120,
    "unique_visitors": 720,
    "clones": 88,
    "unique_cloners": 61,
    "top_referrer": "kaggle.com",
    "top_referrer_views": 220,
    "top_path": "/notebooks",
    "top_path_views": 180,
    "fetched_at": "2024-10-15 12:00 UTC",
    language: "Python",
    topics: ["machine-learning", "notebooks", "pytorch"],
    watchers_count: 38,
    open_issues_count: 4,
    open_prs: 2,
    total_commits: 65,
    total_releases: 1,
    last_release_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    pushed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: "2024-01-15T10:00:00Z",
    has_readme: true,
    has_license: true,
    has_contributing: false,
    has_code_of_conduct: false,
    _daily_views: days(78, 30, 14, false, 4),
    _daily_clones: days(6, 4, 14, true, 4),
    _referrers: [{ referrer: "kaggle.com", count: 220, uniques: 180 }],
    _paths: [{ path: "/notebooks", title: "Notebooks", count: 180, uniques: 150 }],
  },
  {
    repository: "ameyac11/snippets",
    is_private: false,
    stars: 19,
    forks: 3,
    "views": 640,
    "unique_visitors": 410,
    "clones": 52,
    "unique_cloners": 38,
    "top_referrer": "google.com",
    "top_referrer_views": 140,
    "top_path": "/",
    "top_path_views": 120,
    "fetched_at": "2024-10-15 12:00 UTC",
    language: "Shell",
    topics: ["bash", "dotfiles", "linux"],
    watchers_count: 19,
    open_issues_count: 0,
    open_prs: 0,
    total_commits: 24,
    total_releases: 0,
    last_release_at: null,
    pushed_at: new Date(Date.now() - 200 * 86400000).toISOString(),
    created_at: "2021-06-10T10:00:00Z",
    has_readme: true,
    has_license: false,
    has_contributing: false,
    has_code_of_conduct: false,
    _daily_views: days(44, 18, 14, false, 5),
    _daily_clones: days(4, 3, 14, true, 5),
    _referrers: [],
    _paths: [],
  },
];

// No manual spike injection on repo 0 to preserve its beautiful custom curve

// Calculate totals dynamically from daily arrays to match chart values exactly
DEMO_DATA.forEach((r) => {
  r.views = (r._daily_views ?? []).reduce((sum, p) => sum + p.count, 0);
  r.unique_visitors = Math.round(r.views * 0.61);
  r.clones = (r._daily_clones ?? []).reduce((sum, p) => sum + p.count, 0);
  r.unique_cloners = Math.round(r.clones * 0.65);

  if (r._referrers && r._referrers.length > 0) {
    const refSum = r._referrers.reduce((s, x) => s + x.count, 0);
    if (refSum > 0) {
      const factor = (r.views * 0.5) / refSum;
      r._referrers.forEach((ref) => {
        ref.count = Math.round(ref.count * factor);
        ref.uniques = Math.round(ref.count * 0.7);
      });
      r.top_referrer = r._referrers[0].referrer;
      r.top_referrer_views = r._referrers[0].count;
    }
  }

  if (r._paths && r._paths.length > 0) {
    const pathSum = r._paths.reduce((s, x) => s + x.count, 0);
    if (pathSum > 0) {
      const factor = (r.views * 0.6) / pathSum;
      r._paths.forEach((p) => {
        p.count = Math.round(p.count * factor);
        p.uniques = Math.round(p.count * 0.8);
      });
      r.top_path = r._paths[0].path;
      r.top_path_views = r._paths[0].count;
    }
  }
});

import type { PublicProfile, PublicRepo } from "./github-public";

export const DEMO_USERNAME_PROFILE: PublicProfile = {
  login: "gitlytics",
  name: "Gitlytics",
  avatar_url: "/gitlytics-logo.png",
  bio: "Demo profile — exploring Gitlytics with sample data.",
  location: "San Francisco",
  blog: "https://gitlytics.dev",
  twitter_username: "gitlytics",
  html_url: "https://github.com/ameyac11/gitlytics",
  followers: 12480,
  following: 9,
  public_repos: DEMO_DATA.length,
  created_at: "2024-01-25T18:44:36Z",
};

export const DEMO_USERNAME_REPOS: PublicRepo[] = DEMO_DATA.map((r, i) => {
  const [, name] = r.repository.split("/");
  const langs = ["TypeScript", "Python", "Go", "JavaScript", "Rust", "Shell"];
  return {
    name,
    full_name: r.repository,
    description: "Demo repository — sample data for previewing Gitlytics.",
    html_url: `https://github.com/${r.repository}`,
    fork: false,
    stargazers_count: r.stars,
    forks_count: r.forks,
    watchers_count: r.stars,
    language: langs[i % langs.length],
    open_issues_count: Math.max(0, Math.round(r.stars / 50)),
    topics: ["analytics", "github", "traffic"].slice(0, (i % 3) + 1),
    pushed_at: new Date(Date.now() - i * 86400000).toISOString(),
    created_at: "2023-05-12T10:00:00Z",
    default_branch: "main",
    total_commits: r.total_commits,
    open_prs: r.open_prs,
    total_releases: r.total_releases,
    last_release_at: r.last_release_at,
    has_readme: r.has_readme,
    has_license: r.has_license,
    has_contributing: r.has_contributing,
    has_code_of_conduct: r.has_code_of_conduct,
  };
});
