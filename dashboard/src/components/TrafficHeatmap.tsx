import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { CalendarDays } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { dayOfWeekTraffic } from "@/lib/analytics";
import { useIsExporting } from "@/hooks/use-export-state";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        Views: <span className="font-semibold text-foreground">{payload[0].value.toLocaleString()}</span>
      </p>
    </div>
  );
}

export function TrafficHeatmap({ repos }: { repos: RepoTraffic[] }) {
  const data = dayOfWeekTraffic(repos);
  const max = Math.max(1, ...data.map((d) => d.views));
  const isExporting = useIsExporting();

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Traffic Patterns — Day of Week</h3>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={56} tickMargin={4} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}
          />
          <Bar dataKey="views" name="Views" radius={[4, 4, 0, 0]} isAnimationActive={!isExporting}>
            {data.map((d, i) => (
              <Cell key={i} fill="var(--chart-1)" fillOpacity={0.35 + (d.views / max) * 0.65} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
