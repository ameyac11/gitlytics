import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Eye, Download } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { useIsExporting } from "@/hooks/use-export-state";

function shortName(full: string) {
  const parts = full.split("/");
  return parts[parts.length - 1];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {payload[0].name}:{" "}
        <span className="font-semibold text-foreground">{payload[0].value.toLocaleString()}</span>
      </p>
    </div>
  );
}

function TopBarChart({
  title,
  icon: Icon,
  data,
  color,
  name,
}: {
  title: string;
  icon: typeof Eye;
  data: { name: string; value: number }[];
  color: string;
  name: string;
}) {
  const isExporting = useIsExporting();

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-40}
              textAnchor="end"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              interval={0}
              height={75}
              tickFormatter={(val) => (val && val.length > 16) ? `${val.slice(0, 13)}...` : val}
            />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={56} tickMargin={4} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}
            />
            <Bar dataKey="value" name={name} radius={[4, 4, 0, 0]} isAnimationActive={!isExporting}>
              {data.map((_, i) => (
                <Cell key={i} fill={color} fillOpacity={1 - i * 0.04} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function TrafficCharts({ repos, topN }: { repos: RepoTraffic[]; topN: number }) {
  const byViews = [...repos]
    .sort((a, b) => b["views"] - a["views"])
    .slice(0, topN)
    .map((r) => ({ name: shortName(r.repository), value: r["views"] }));

  const byClones = [...repos]
    .sort((a, b) => b["clones"] - a["clones"])
    .slice(0, topN)
    .map((r) => ({ name: shortName(r.repository), value: r["clones"] }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TopBarChart
        title={`Top ${topN} Repositories by Views`}
        icon={Eye}
        data={byViews}
        color="var(--chart-1)"
        name="Views"
      />
      <TopBarChart
        title={`Top ${topN} Repositories by Clones`}
        icon={Download}
        data={byClones}
        color="var(--chart-2)"
        name="Clones"
      />
    </div>
  );
}
