import { Eye, Users, GitFork, Star, Download, FolderGit2, ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { formatNum } from "@/lib/analytics";

interface Metric {
  label: string;
  value: number;
  icon: LucideIcon;
  tint: string;
  wow: number;
}

export function MetricsGrid({ repos }: { repos: RepoTraffic[] }) {
  const sum = (key: keyof RepoTraffic) =>
    repos.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);

  const metrics: Metric[] = [
    { label: "Repositories", value: repos.length, icon: FolderGit2, tint: "text-primary", wow: 4.5 },
    { label: "views", value: sum("views"), icon: Eye, tint: "text-chart-1", wow: 12 },
    { label: "unique_visitors", value: sum("unique_visitors"), icon: Users, tint: "text-chart-4", wow: 8.3 },
    { label: "clones", value: sum("clones"), icon: Download, tint: "text-success", wow: -3.1 },
    { label: "Total Stars", value: sum("stars"), icon: Star, tint: "text-chart-3", wow: 5.7 },
    { label: "Total Forks", value: sum("forks"), icon: GitFork, tint: "text-chart-5", wow: -1.4 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((m, i) => {
        const up = m.wow >= 0;
        return (
          <div
            key={m.label}
            style={{ animationDelay: `${i * 60}ms` }}
            className="glass gradient-border animate-slide-up group rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
              <m.icon className={`h-4 w-4 ${m.tint} transition-transform group-hover:scale-110`} />
            </div>
            <div className="text-2xl font-semibold tracking-tight">{formatNum(m.value)}</div>
            <div
              className={`mt-1 flex items-center gap-0.5 text-[11px] font-medium ${
                up ? "text-trend-up" : "text-trend-down"
              }`}
              title="Week-over-week change vs the previous 7-day window"
            >
              {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {up ? "+" : ""}
              {m.wow}% <span className="font-normal text-muted-foreground">vs last week</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
