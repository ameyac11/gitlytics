import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Code2 } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { languageDistribution, LANG_FILL, LANG_TINT } from "@/lib/analytics";
import { useIsExporting } from "@/hooks/use-export-state";

export function LanguageDistribution({ repos }: { repos: RepoTraffic[] }) {
  const dist = languageDistribution(repos);
  const data = dist.map((d) => ({ name: d.language, value: d.percent, fill: LANG_FILL[d.language] }));
  const isExporting = useIsExporting();

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl p-5">
      <div
        className="mb-4 flex items-center gap-2"
        title="Share of each programming language across all repositories, weighted by commit volume"
      >
        <Code2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Repository Languages</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(220px,300px)_1fr]">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={2} stroke="none" isAnimationActive={!isExporting}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
              formatter={(v: number, n: string) => [`${v}%`, n]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-center gap-3">
          {dist.map((d) => (
            <div key={d.language} className="flex items-center gap-3">
              <span className={`w-24 shrink-0 text-xs font-medium ${LANG_TINT[d.language]}`}>
                {d.language}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/5">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${d.percent}%`, background: LANG_FILL[d.language] }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-muted-foreground">
                {d.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
