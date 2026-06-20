import { Activity } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { lifetimeStats, formatNum } from "@/lib/analytics";

export function LifetimeHero({ repos }: { repos: RepoTraffic[] }) {
  const { views, repos: count } = lifetimeStats(repos);
  return (
    <div className="glass gradient-border animate-slide-up relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 sm:flex-row sm:items-center sm:gap-4">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-primary/60" />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <Activity className="h-5 w-5 text-primary" />
      </div>
      <p className="text-base leading-relaxed sm:text-lg">
        Your repositories have been viewed{" "}
        <span className="font-semibold text-primary tabular-nums">{views.toLocaleString()}</span> times in total
        across <span className="font-semibold text-primary tabular-nums">{count}</span> repos since tracking began.
      </p>
    </div>
  );
}
