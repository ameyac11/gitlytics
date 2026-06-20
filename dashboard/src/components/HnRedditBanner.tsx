import { Megaphone, X } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { hnRedditAlert } from "@/lib/analytics";

export function HnRedditBanner({ repos, onDismiss }: { repos: RepoTraffic[]; onDismiss: () => void }) {
  const alert = hnRedditAlert(repos);
  if (!alert) return null;
  return (
    <div className="glass animate-slide-up flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <Megaphone className="h-4 w-4 text-primary" />
        </div>
        <p className="text-sm">
          <span className="text-muted-foreground">You were likely posted on </span>
          <span className="font-semibold text-primary">{alert.source}</span>
          <span className="text-muted-foreground"> on </span>
          <span className="font-semibold">{alert.date}</span>
          <span className="text-muted-foreground"> — this caused your biggest traffic spike on </span>
          <span className="font-semibold text-primary">{alert.repo}</span>
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
