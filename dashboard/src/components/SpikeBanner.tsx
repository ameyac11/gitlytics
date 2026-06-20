import { Flame, X } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";

export function SpikeBanner({
  repos,
  onDismiss,
}: {
  repos: RepoTraffic[];
  onDismiss: () => void;
}) {
  if (repos.length === 0) return null;
  const r = repos[0];

  return (
    <div className="glass animate-slide-up flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <Flame className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm">
          <span className="font-semibold text-primary">{r.repository}</span>{" "}
          <span className="text-muted-foreground">is trending — 3x normal traffic today</span>
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
