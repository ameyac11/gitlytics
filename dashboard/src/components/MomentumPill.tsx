import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { repoMomentum } from "@/lib/analytics";

export function MomentumPill({ repo }: { repo: RepoTraffic }) {
  const { trend, pct } = repoMomentum(repo);
  if (trend === "up") {
    return (
      <span
        title={`Growing — last 7 days vs previous 7 days (${pct >= 0 ? "+" : ""}${pct}%)`}
        className="inline-flex items-center gap-1 rounded-md bg-trend-up/10 px-1.5 py-0.5 text-[11px] font-medium text-trend-up border border-trend-up/25"
      >
        <ArrowUp className="h-3 w-3" /> Growing
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span
        title={`Declining — last 7 days vs previous 7 days (${pct}%)`}
        className="inline-flex items-center gap-1 rounded-md bg-trend-down/10 px-1.5 py-0.5 text-[11px] font-medium text-trend-down border border-trend-down/25"
      >
        <ArrowDown className="h-3 w-3" /> Declining
      </span>
    );
  }
  return (
    <span
      title="Stable — last 7 days vs previous 7 days (within ±8%)"
      className="inline-flex items-center gap-1 rounded-md bg-foreground/5 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground border border-border"
    >
      <Minus className="h-3 w-3" /> Stable
    </span>
  );
}
