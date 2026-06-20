import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Globe, History, Network } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { globalReferrers, trafficSourceTimeline, crossRepoReferrers } from "@/lib/analytics";
import { CategoryBadge } from "./CategoryBadge";
import { useIsExporting } from "@/hooks/use-export-state";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-foreground">{p.referrer}</p>
      <p className="text-muted-foreground">
        Views: <span className="font-semibold text-foreground">{p.count.toLocaleString()}</span>
      </p>
      <p className="text-muted-foreground">
        Uniques: <span className="font-semibold text-foreground">{p.uniques.toLocaleString()}</span>
      </p>
    </div>
  );
}

export function GlobalReferrers({ repos, advanced = false }: { repos: RepoTraffic[]; advanced?: boolean }) {
  const data = globalReferrers(repos).slice(0, 10);
  const height = Math.max(220, data.length * 38);
  const timeline = advanced ? trafficSourceTimeline(repos) : [];
  const overlap = advanced ? crossRepoReferrers(repos) : [];
  const isExporting = useIsExporting();

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Traffic Sources — All Repositories</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(220px,300px)]">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="referrer"
              width={140}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}
            />
            <Bar dataKey="count" name="Views" radius={[0, 4, 4, 0]} isAnimationActive={!isExporting}>
              {data.map((_, i) => (
                <Cell key={i} fill="var(--chart-1)" fillOpacity={1 - i * 0.06} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="overflow-hidden rounded-lg border border-border/60 bg-background/30">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 text-right font-medium">Views</th>
                <th className="px-3 py-2 text-right font-medium">Uniques</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.referrer} className="border-b border-border/40 last:border-0">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate" title={r.referrer}>
                        {r.referrer}
                      </span>
                      <CategoryBadge referrer={r.referrer} />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.count.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {r.uniques.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {advanced && timeline.length > 0 && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-semibold">Traffic Source Timeline</h4>
            <span className="text-[11px] text-muted-foreground">— when each major referrer first appeared</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {timeline.map((t, i) => (
              <div key={t.referrer} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[11px]">
                  <span className="font-medium">{t.referrer}</span>
                  <span className="text-muted-foreground">→ {t.month}</span>
                </span>
                {i < timeline.length - 1 && <span className="text-muted-foreground">·</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {advanced && overlap.length > 0 && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-semibold">Referrers reaching multiple repositories</h4>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/60 bg-background/30">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Referrer</th>
                  <th className="px-3 py-2 text-right font-medium">Repos it hits</th>
                  <th className="px-3 py-2 text-right font-medium">Total views</th>
                </tr>
              </thead>
              <tbody>
                {overlap.map((r) => (
                  <tr key={r.referrer} className="border-b border-border/40 last:border-0">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{r.referrer}</span>
                        <CategoryBadge referrer={r.referrer} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{r.repos}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {r.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
