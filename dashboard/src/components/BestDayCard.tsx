import { Trophy } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { bestDayEver } from "@/lib/analytics";

export function BestDayCard({ repos }: { repos: RepoTraffic[] }) {
  const b = bestDayEver(repos);
  if (!b) return null;
  return (
    <div className="glass gradient-border animate-slide-up relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 sm:flex-row sm:items-center sm:gap-4">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-primary/60" />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <Trophy className="h-5 w-5 text-primary" />
      </div>
      <p className="text-base leading-relaxed sm:text-lg">
        Your best day ever was{" "}
        <span className="font-semibold text-primary">{b.date}</span> —{" "}
        <span className="font-semibold tabular-nums">{b.views.toLocaleString()}</span> views on{" "}
        <span className="font-semibold text-primary">{b.repo}</span>
      </p>
    </div>
  );
}
