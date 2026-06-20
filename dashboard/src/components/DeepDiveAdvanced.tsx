import { Check, X, Rocket, Lock } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { launchReadiness, readmeQuality, starForkRatio } from "@/lib/analytics";

export function LaunchReadinessCard({ repo }: { repo: RepoTraffic }) {
  const lr = launchReadiness(repo);
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Rocket className="h-3.5 w-3.5 text-primary" /> Ready to post on HN or Reddit?
        </div>
        {lr.hasData && (
          <span className="text-xs font-semibold tabular-nums text-primary">
            {lr.score}/{lr.total} ready
          </span>
        )}
      </div>
      {!lr.hasData ? (
        <div className="flex flex-col items-center justify-center gap-2 py-3 text-center text-[11px] text-muted-foreground">
          <Lock className="h-4 w-4 opacity-50" />
          <p>Requires Personal Access Token (Live API mode) to scan repository files.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {lr.items.map((i) => (
            <li key={i.label} className="flex items-center gap-1.5 text-[11px]">
              {i.ok ? (
                <Check className="h-3 w-3 text-trend-up" />
              ) : (
                <X className="h-3 w-3 text-trend-down" />
              )}
              <span className={i.ok ? "text-foreground" : "text-muted-foreground"}>{i.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReadmeQualityCard({ repo }: { repo: RepoTraffic }) {
  const q = readmeQuality(repo);
  return (
    <div
      className="rounded-lg border border-border/60 bg-background/30 p-3"
      title="Missing files reduce visitor trust and conversion rate"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">README Quality</p>
        {!q.hasData && <Lock className="h-3 w-3 text-muted-foreground opacity-50" />}
      </div>
      {!q.hasData ? (
        <div className="mt-2 text-[11px] text-muted-foreground">
          Requires PAT (Live API mode)
        </div>
      ) : (
        <>
          <p className="mt-1 text-xl font-semibold tabular-nums text-primary">
            {q.score}/{q.total}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {q.items.map((i) => (
              <span
                key={i.label}
                className={`text-[10px] ${i.ok ? "text-trend-up" : "text-trend-down"}`}
                title={i.label}
              >
                {i.ok ? "✓" : "✗"} {i.label.replace("Has ", "")}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function StarForkRatioCard({ repo }: { repo: RepoTraffic }) {
  const r = starForkRatio(repo);
  return (
    <div
      className="rounded-lg border border-border/60 bg-background/30 p-3"
      title="High ratio means people admire but don't contribute. Low ratio means active contributors but less community buzz."
    >
      <p className="text-[11px] font-medium text-muted-foreground">Star / Fork</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-primary">{r.toFixed(1)}x</p>
    </div>
  );
}
