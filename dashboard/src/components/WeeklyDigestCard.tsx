import { CalendarRange, ArrowUp, ArrowDown } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { weeklyDigest } from "@/lib/analytics";

export function WeeklyDigestCard({ repos }: { repos: RepoTraffic[] }) {
  const d = weeklyDigest(repos);
  const vUp = d.viewsPct >= 0;
  const cUp = d.clonesPct >= 0;
  return (
    <div className="glass gradient-border animate-slide-up relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 sm:flex-row sm:items-center sm:gap-4">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-primary/60" />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <CalendarRange className="h-5 w-5 text-primary" />
      </div>
      <p className="text-sm leading-relaxed sm:text-base">
        <span className="font-semibold text-primary">This week:</span>{" "}
        <span className="font-semibold tabular-nums">+{d.views.toLocaleString()}</span> views{" "}
        <span className={`inline-flex items-center gap-0.5 align-middle text-xs font-medium tabular-nums ${vUp ? "text-trend-up" : "text-trend-down"}`}>
          {vUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {vUp ? "+" : ""}{d.viewsPct}%
        </span>,{" "}
        <span className="font-semibold tabular-nums">+{d.clones.toLocaleString()}</span> clones{" "}
        <span className={`inline-flex items-center gap-0.5 align-middle text-xs font-medium tabular-nums ${cUp ? "text-trend-up" : "text-trend-down"}`}>
          {cUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {cUp ? "+" : ""}{d.clonesPct}%
        </span>,{" "}
        <span className="font-semibold text-primary tabular-nums">{d.newRefs}</span> new referrers appeared.
      </p>
    </div>
  );
}
