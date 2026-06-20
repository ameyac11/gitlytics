import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { useIsExporting } from "@/hooks/use-export-state";

export function CumulativeGrowth({ repos }: { repos: RepoTraffic[] }) {
  const data = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const r of repos) {
      for (const d of r._daily_views || []) {
        byDay.set(d.timestamp, (byDay.get(d.timestamp) || 0) + d.count);
      }
    }
    const sorted = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    let running = 0;
    return sorted.map(([t, v]) => {
      running += v;
      return { date: t.slice(5), cumulative: running };
    });
  }, [repos]);
  const isExporting = useIsExporting();

  if (data.length === 0) {
    return (
      <div className="glass gradient-border rounded-xl p-6 text-center text-sm text-muted-foreground">
        No data available in your uploaded CSV
      </div>
    );
  }

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <div>
          <h3 className="text-sm font-semibold">Cumulative Growth</h3>
          <p className="text-xs text-muted-foreground">Total views over time — all repos combined</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} width={56} tickMargin={4} />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#cumGrad)"
            isAnimationActive={!isExporting}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}