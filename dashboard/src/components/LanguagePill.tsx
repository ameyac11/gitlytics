// Copyright (c) 2024 Ameya Chopade. Licensed under Apache-2.0 with Commons Clause.
// Commercial use and cloud deployment as a service are strictly prohibited.
// See LICENSE.md for full terms.
import { repoLanguage, LANG_TINT } from "@/lib/analytics";
import type { RepoTraffic } from "@/lib/github-api";

// Accepts either a full RepoTraffic object or a plain repo name string
export function LanguagePill({ repo }: { repo: RepoTraffic | string }) {
  const repoObj: RepoTraffic = typeof repo === "string"
    ? { repository: repo, is_private: false, stars: 0, forks: 0, views: 0, unique_visitors: 0, clones: 0, unique_cloners: 0 }
    : repo;
  const lang = repoLanguage(repoObj);
  if (lang === "Other" && typeof repo === "string") return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium border border-border ${LANG_TINT[lang]}`}
    >
      {lang}
    </span>
  );
}
