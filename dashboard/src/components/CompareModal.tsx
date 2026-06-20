import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { X, Eye, GitFork, Star, Download, Activity, Link2 } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { healthScore } from "@/lib/analytics";

function shortName(full: string) {
  const parts = full.split("/");
  return parts[parts.length - 1];
}

function formatNum(n: number | undefined) {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString();
}

function StatRow({
  icon: Icon,
  label,
  a,
  b,
  aWins,
  bWins,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  a: string | number;
  b: string | number;
  aWins?: boolean;
  bWins?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border/60 py-2.5 text-sm last:border-0">
      <div
        className={`min-w-0 truncate pr-3 text-right font-semibold tabular-nums ${
          aWins ? "text-primary" : "text-foreground/80"
        }`}
        title={String(a)}
      >
        {a}
      </div>
      <div className="flex w-28 items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="truncate">{label}</span>
      </div>
      <div
        className={`min-w-0 truncate pl-3 text-left font-semibold tabular-nums ${
          bWins ? "text-chart-2" : "text-foreground/80"
        }`}
        title={String(b)}
      >
        {b}
      </div>
    </div>
  );
}

export function CompareModal({
  repoA,
  repoB,
  onClose,
}: {
  repoA: RepoTraffic;
  repoB: RepoTraffic;
  onClose: () => void;
}) {
  const data = useMemo(() => {
    const map = new Map<string, { date: string; a: number; b: number }>();
    const add = (repo: RepoTraffic, key: "a" | "b") => {
      (repo._daily_views ?? []).forEach((p) => {
        const date = p.timestamp.slice(0, 10);
        const e = map.get(date) ?? { date, a: 0, b: 0 };
        e[key] += p.count;
        map.set(date, e);
      });
    };
    add(repoA, "a");
    add(repoB, "b");
    return [...map.values()].sort((x, y) => x.date.localeCompare(y.date));
  }, [repoA, repoB]);

  const hA = healthScore(repoA).total;
  const hB = healthScore(repoB).total;

  const nameA = shortName(repoA.repository);
  const nameB = shortName(repoB.repository);

  // Lock body scroll + ESC to close while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-3 backdrop-blur-md sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass animate-slide-up max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Repository Comparison</h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Side-by-side metrics &amp; daily view trend
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Repo labels */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="min-w-0 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-right">
              <p className="truncate text-sm font-semibold text-primary" title={repoA.repository}>
                {nameA}
              </p>
              <p className="truncate text-[10px] text-muted-foreground" title={repoA.repository}>
                {repoA.repository}
              </p>
            </div>
            <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              vs
            </span>
            <div className="min-w-0 rounded-lg border border-chart-2/30 bg-chart-2/10 px-3 py-2 text-left">
              <p className="truncate text-sm font-semibold text-chart-2" title={repoB.repository}>
                {nameB}
              </p>
              <p className="truncate text-[10px] text-muted-foreground" title={repoB.repository}>
                {repoB.repository}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Daily Views
            </h4>
            <div className="rounded-lg border border-border/60 bg-background/30 p-2">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cmpA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cmpB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    tickFormatter={(d) => d.slice(5)}
                    minTickGap={24}
                  />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} width={40} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="a"
                    name={nameA}
                    stroke="var(--chart-1)"
                    fill="url(#cmpA)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="b"
                    name={nameB}
                    stroke="var(--chart-2)"
                    fill="url(#cmpB)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-lg border border-border/60 bg-background/30 px-4 py-1">
            <StatRow
              icon={Eye}
              label="Views"
              a={formatNum(repoA["views"])}
              b={formatNum(repoB["views"])}
              aWins={repoA["views"] > repoB["views"]}
              bWins={repoB["views"] > repoA["views"]}
            />
            <StatRow
              icon={Download}
              label="Clones"
              a={formatNum(repoA["clones"])}
              b={formatNum(repoB["clones"])}
              aWins={repoA["clones"] > repoB["clones"]}
              bWins={repoB["clones"] > repoA["clones"]}
            />
            <StatRow
              icon={Star}
              label="Stars"
              a={formatNum(repoA.stars)}
              b={formatNum(repoB.stars)}
              aWins={repoA.stars > repoB.stars}
              bWins={repoB.stars > repoA.stars}
            />
            <StatRow
              icon={GitFork}
              label="Forks"
              a={formatNum(repoA.forks)}
              b={formatNum(repoB.forks)}
              aWins={repoA.forks > repoB.forks}
              bWins={repoB.forks > repoA.forks}
            />
            <StatRow
              icon={Activity}
              label="Health"
              a={`${hA}/100`}
              b={`${hB}/100`}
              aWins={hA > hB}
              bWins={hB > hA}
            />
            <StatRow
              icon={Link2}
              label="top_referrer"
              a={repoA["top_referrer"] || "—"}
              b={repoB["top_referrer"] || "—"}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
