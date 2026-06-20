// Copyright (c) 2024 Ameya Chopade. Licensed under Apache-2.0 with Commons Clause.
// Commercial use and cloud deployment as a service are strictly prohibited.
// See LICENSE.md for full terms.
import { Tag } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";

export function TopicTags({ repo, onTopic }: { repo: RepoTraffic | string; onTopic?: (t: string) => void }) {
  // Accept both a full RepoTraffic object and a plain string (legacy call sites)
  const topics: string[] = typeof repo === "string" ? [] : (repo.topics ?? []);
  if (topics.length === 0) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Tag className="h-3.5 w-3.5 text-primary" /> Topics
      </div>
      <div className="flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => onTopic?.(t)}
            className="inline-flex items-center rounded-md bg-foreground/5 px-2 py-0.5 text-[11px] font-medium text-foreground border border-border transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
