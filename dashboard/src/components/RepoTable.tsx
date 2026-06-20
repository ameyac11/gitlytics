// Copyright (c) 2024 Ameya Chopade. Licensed under Apache-2.0 with Commons Clause.
// Commercial use and cloud deployment as a service are strictly prohibited.
// See LICENSE.md for full terms.
import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ArrowUpDown,
  Lock,
  Star,
  Eye,
  Download,
  ExternalLink,
  ChevronDown,
  Link2,
  FileText,
  Flame,
  Pin,
  GitCompare,
  Gauge,
  Users,
  GitFork,
  GitCommitHorizontal,
  Clock,
  CalendarClock,
  CircleDot,
  GitPullRequest,
} from "lucide-react";
import { useIsExporting } from "@/hooks/use-export-state";
import type { RepoTraffic } from "@/lib/github-api";
import {
  cloneStarRatio,
  forkCloneRatio,
  healthScore,
  healthTint,
  isTrending,
  isNewThisWeek,
  audienceBreakdown,
  firstSeen,
  repoMeta,
  relativeDays,
  relativeMonths,
  repoTopics,
  releaseInfo,
  referrerQuality,
} from "@/lib/analytics";
import { CategoryBadge } from "./CategoryBadge";
import { LanguagePill } from "./LanguagePill";
import { TrendingPill, NewPill, PinnedPill } from "./StatusPills";
import { CompareModal } from "./CompareModal";
import { MomentumPill } from "./MomentumPill";
import { TopicTags } from "./TopicTags";
import { LaunchReadinessCard, ReadmeQualityCard, StarForkRatioCard } from "./DeepDiveAdvanced";

type SortKey = "stars" | "views" | "clones" | "Clone/Star" | "Fork/Clone" | "Health";

const accessor: Record<SortKey, (r: RepoTraffic) => number> = {
  stars: (r) => Number(r.stars) || 0,
  "views": (r) => Number(r["views"]) || 0,
  "clones": (r) => Number(r["clones"]) || 0,
  "Clone/Star": cloneStarRatio,
  "Fork/Clone": forkCloneRatio,
  Health: (r) => healthScore(r).total,
};

const COLUMNS: { key: SortKey; label: string; icon: typeof Star; tip?: string }[] = [
  { key: "stars", label: "stars", icon: Star },
  { key: "views", label: "Views", icon: Eye },
  { key: "clones", label: "Clones", icon: Download },
  {
    key: "Clone/Star",
    label: "Clone/Star",
    icon: GitCompare,
    tip: "High ratio means people clone more than they star — consider improving your README",
  },
  {
    key: "Fork/Clone",
    label: "Fork/Clone",
    icon: GitFork,
    tip: "High ratio means people want to contribute, not just use your project",
  },
  {
    key: "Health",
    label: "Health",
    icon: Gauge,
    tip: "Composite score based on view trend, clone trend, star velocity and fork activity",
  },
];

/* ---------- charts ---------- */
function DailyTrendsChart({ repo }: { repo: RepoTraffic }) {
  const isExporting = useIsExporting();
  const data = useMemo(() => {
    const map = new Map<string, { date: string; views: number; clones: number }>();
    const fmt = (ts: string) => ts.slice(0, 10);
    (repo._daily_views ?? []).forEach((p) => {
      const date = fmt(p.timestamp);
      const e = map.get(date) ?? { date, views: 0, clones: 0 };
      e.views += p.count;
      map.set(date, e);
    });
    (repo._daily_clones ?? []).forEach((p) => {
      const date = fmt(p.timestamp);
      const e = map.get(date) ?? { date, views: 0, clones: 0 };
      e.clones += p.count;
      map.set(date, e);
    });
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [repo]);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border/60 text-sm text-muted-foreground">
        No daily trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
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
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} width={52} tickMargin={4} />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            paddingBottom: 8,
          }}
        />
        <Area type="monotone" dataKey="views" name="Views" stroke="var(--chart-1)" fill="url(#gv)" strokeWidth={2} isAnimationActive={!isExporting} />
        <Area type="monotone" dataKey="clones" name="Clones" stroke="var(--chart-2)" fill="url(#gc)" strokeWidth={2} isAnimationActive={!isExporting} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Star Velocity removed — GitHub API does not provide daily star history

function AudienceDonut({ repo }: { repo: RepoTraffic }) {
  const isExporting = useIsExporting();
  const { unique, returning } = audienceBreakdown(repo);
  const data = [
    { name: "Unique", value: unique, fill: "var(--chart-1)" },
    { name: "Returning", value: returning, fill: "var(--chart-3)" },
  ];
  return (
    <div
      className="rounded-lg border border-border/60 bg-background/30 p-3"
      title="High unique % means viral traffic. High returning % means loyal community."
    >
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold">
        <Users className="h-3.5 w-3.5 text-primary" />
        Audience Breakdown
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={36} outerRadius={56} paddingAngle={2} stroke="none" isAnimationActive={!isExporting}>
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
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-3 text-[11px]">
        <span className="flex items-center gap-1 text-chart-1">
          <span className="h-2 w-2 rounded-full bg-chart-1" /> {unique}% Unique
        </span>
        <span className="flex items-center gap-1 text-chart-3">
          <span className="h-2 w-2 rounded-full bg-chart-3" /> {returning}% Returning
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, value, tip }: { label: string; value: string; tip: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-3" title={tip}>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-primary">{value}</p>
    </div>
  );
}

function MetaCard({
  label,
  value,
  icon: Icon,
  tip,
}: {
  label: string;
  value: string;
  icon: typeof Star;
  tip: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-3" title={tip}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums text-primary">{value}</p>
    </div>
  );
}

function RepoMetaRow({ repo }: { repo: RepoTraffic }) {
  const m = repoMeta(repo);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MetaCard
        label="Total Commits"
        value={m.totalCommits.toLocaleString()}
        icon={GitCommitHorizontal}
        tip="Total number of commits made to this repository"
      />
      <MetaCard
        label="Last Pushed"
        value={relativeDays(m.lastPushedDays)}
        icon={Clock}
        tip="When the most recent commit was pushed"
      />
      <MetaCard
        label="Repo Age"
        value={relativeMonths(m.ageMonths)}
        icon={CalendarClock}
        tip="How long ago this repository was created"
      />
      <MetaCard
        label="Watchers"
        value={m.watchers.toLocaleString()}
        icon={Eye}
        tip="Number of users watching this repository for updates"
      />
      <MetaCard
        label="Open Issues"
        value={m.openIssues.toLocaleString()}
        icon={CircleDot}
        tip="Number of currently open issues"
      />
      <MetaCard
        label="Open PRs"
        value={m.openPRs.toLocaleString()}
        icon={GitPullRequest}
        tip="Number of currently open pull requests"
      />
    </div>
  );
}


function HealthCard({ repo }: { repo: RepoTraffic }) {
  const h = healthScore(repo);
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
        <Gauge className="h-3.5 w-3.5 text-primary" />
        Health Score
      </div>
      <p className={`text-2xl font-semibold tabular-nums ${healthTint(h.total)}`}>{h.total}/100</p>
      <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
        <span>View Trend: {h.view}/25</span>
        <span>Clone Trend: {h.clone}/25</span>
        <span>Star Velocity: {h.star}/25</span>
        <span>Fork Activity: {h.fork}/25</span>
      </div>
    </div>
  );
}

function ReferrerTable({ repo, advanced = false }: { repo: RepoTraffic; advanced?: boolean }) {
  const rows = repo._referrers ?? [];
  return (
    <div className="rounded-lg border border-border/60 bg-background/30">
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2 text-xs font-semibold">
        <Link2 className="h-3.5 w-3.5 text-primary" />
        Top Referrers
      </div>
      {rows.length === 0 ? (
        <div className="px-3 py-6 text-center text-xs text-muted-foreground">No data available</div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="px-3 py-1.5 font-medium">Referrer</th>
              <th className="px-3 py-1.5 font-medium">First Seen</th>
              <th className="px-3 py-1.5 text-right font-medium">Views</th>
              <th className="px-3 py-1.5 text-right font-medium">Uniques</th>
              {advanced && (
                <th
                  className="px-3 py-1.5 text-right font-medium"
                  title="Measures how engaged the visitors from this source actually are"
                >
                  Quality
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((r, i) => {
              const q = advanced ? referrerQuality(repo, r) : null;
              const qTint =
                q === "High"
                  ? "bg-trend-up/10 text-trend-up border border-trend-up/25"
                  : q === "Medium"
                  ? "bg-chart-2/10 text-chart-2 border border-chart-2/25"
                  : "bg-trend-down/10 text-trend-down border border-trend-down/25";
              return (
                <tr key={i} className="border-t border-border/40">
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="max-w-[120px] truncate" title={r.referrer}>
                        {r.referrer}
                      </span>
                      <CategoryBadge referrer={r.referrer} />
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-muted-foreground">{firstSeen(repo.repository, r.referrer)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{r.count.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                    {r.uniques.toLocaleString()}
                  </td>
                  {advanced && q && (
                    <td className="px-3 py-1.5 text-right">
                      <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${qTint}`}>
                        {q}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PathsTable({ repo }: { repo: RepoTraffic }) {
  const rows = repo._paths ?? [];
  return (
    <div className="rounded-lg border border-border/60 bg-background/30">
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2 text-xs font-semibold">
        <FileText className="h-3.5 w-3.5 text-primary" />
        Popular Paths
      </div>
      {rows.length === 0 ? (
        <div className="px-3 py-6 text-center text-xs text-muted-foreground">No data available</div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="px-3 py-1.5 font-medium">Path</th>
              <th className="px-3 py-1.5 text-right font-medium">Views</th>
              <th className="px-3 py-1.5 text-right font-medium">Uniques</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((p, i) => (
              <tr key={i} className="border-t border-border/40">
                <td className="max-w-[160px] truncate px-3 py-1.5" title={p.path}>
                  {p.path}
                  {p.title && <span className="ml-1 text-muted-foreground">{p.title}</span>}
                </td>
                <td className="px-3 py-1.5 text-right tabular-nums">{p.count.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                  {p.uniques.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------- row ---------- */
function RepoRow({
  repo,
  defaultOpen = false,
  forceOpen = false,
  pinned,
  onTogglePin,
  selectMode,
  selected,
  onToggleSelect,
  selectDisabled,
  advanced,
  onTopic,
}: {
  repo: RepoTraffic;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  selectDisabled: boolean;
  advanced: boolean;
  onTopic?: (t: string) => void;
}) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = forceOpen || localOpen;
  const setOpen = setLocalOpen;
  const trending = isTrending(repo);
  const isNew = isNewThisWeek(repo);
  const cs = cloneStarRatio(repo);
  const fc = forkCloneRatio(repo);
  const h = healthScore(repo);

  return (
    <>
      <tr
        onClick={() => !selectMode && setOpen((o) => !o)}
        className={`group border-b border-border/60 transition-colors last:border-0 hover:bg-foreground/[0.03] ${
          selectMode ? "cursor-default" : "cursor-pointer"
        } ${pinned ? "border-l-2 border-l-primary" : ""}`}
      >
        <td className="px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {selectMode && (
              <input
                type="checkbox"
                checked={selected}
                disabled={selectDisabled && !selected}
                onChange={onToggleSelect}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:opacity-40"
              />
            )}
            {!selectMode && (
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
            {trending && <Flame className="h-3.5 w-3.5 shrink-0 text-primary" />}
            {repo.is_private && <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <a
              href={`https://github.com/${repo.repository}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/link flex items-center gap-1 font-medium hover:text-primary"
            >
              {repo.repository}
              <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
            </a>
            <LanguagePill repo={repo.repository} />
            {pinned && <PinnedPill />}
            {trending && <TrendingPill />}
            {isNew && <NewPill />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              aria-label={pinned ? "Unpin" : "Pin"}
              className={`rounded p-0.5 transition-all hover:bg-foreground/5 ${
                pinned ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              <Pin className={`h-3.5 w-3.5 ${pinned ? "fill-primary" : ""}`} />
            </button>
          </div>
        </td>
        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{repo.stars.toLocaleString()}</td>
        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
          {repo["views"].toLocaleString()}
        </td>
        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
          {repo["clones"].toLocaleString()}
        </td>
        {advanced && (
          <>
            <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{cs.toFixed(1)}x</td>
            <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fc.toFixed(2)}x</td>
            <td className="px-4 py-3 text-right">
              <span
                className={`inline-flex items-center rounded-md bg-foreground/5 px-2 py-0.5 text-xs font-semibold tabular-nums border border-border ${healthTint(
                  h.total,
                )}`}
              >
                {h.total}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <MomentumPill repo={repo} />
            </td>
          </>
        )}
        <td className="hidden px-4 py-3 text-right text-muted-foreground lg:table-cell">
          {repo["top_referrer"] || "—"}
        </td>
      </tr>
      {open && !selectMode && (
        <tr className="border-b border-border/60 bg-background/30">
          <td colSpan={advanced ? 9 : 5} className="px-4 py-5">
            <div className="animate-slide-up space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Daily Trends</h4>
                <DailyTrendsChart repo={repo} />
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard
                  label="Clone / Star"
                  value={`${cs.toFixed(1)}x`}
                  tip="High ratio means people clone more than they star — consider improving your README"
                />
                <StatCard
                  label="Fork / Clone"
                  value={`${fc.toFixed(2)}x`}
                  tip="High ratio means people want to contribute, not just use your project"
                />
                <AudienceDonut repo={repo} />
                <HealthCard repo={repo} />
              </div>

              {advanced && <AdvancedDeepDive repo={repo} onTopic={onTopic} />}

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <ReferrerTable repo={repo} advanced={advanced} />
                <PathsTable repo={repo} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DeepDataUnavailable({ reason }: { reason: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/30 px-4 py-3 text-xs text-muted-foreground">
      <span>ℹ️</span>
      <span>{reason}</span>
    </div>
  );
}

function AdvancedDeepDive({ repo, onTopic }: { repo: RepoTraffic; onTopic?: (t: string) => void }) {
  const rel = releaseInfo(repo);
  const m = repoMeta(repo);
  const hasDeepStats = repo.total_commits !== null && repo.total_commits !== undefined;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetaCard label="Total Commits" value={m.totalCommits !== null ? m.totalCommits!.toLocaleString() : "—"} icon={GitCommitHorizontal} tip="Total number of commits made to this repository" />
        <MetaCard label="Last Pushed" value={relativeDays(m.lastPushedDays)} icon={Clock} tip="When the most recent commit was pushed" />
        <MetaCard label="Repo Age" value={relativeMonths(m.ageMonths)} icon={CalendarClock} tip="How long ago this repository was created" />
        <MetaCard label="Watchers" value={m.watchers.toLocaleString()} icon={Eye} tip="Number of users watching this repository for updates" />
        <MetaCard label="Open Issues" value={m.openIssues.toLocaleString()} icon={CircleDot} tip="Number of currently open issues" />
        <MetaCard label="Open PRs" value={m.openPRs !== null ? m.openPRs!.toLocaleString() : "—"} icon={GitPullRequest} tip="Number of currently open pull requests" />
      </div>
      {!hasDeepStats && (
        <DeepDataUnavailable reason="Deep analytics are only fetched for your top 20 repositories." />
      )}
      {hasDeepStats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetaCard label="Total Releases" value={rel.total !== null ? rel.total!.toString() : "—"} icon={Pin} tip="Total number of releases published" />
          <MetaCard label="Last Release" value={relativeDays(rel.lastDaysAgo)} icon={Clock} tip="Time since the most recent release" />
          <MetaCard label="Release Frequency" value={rel.frequency ?? "—"} icon={CalendarClock} tip="Typical cadence of releases" />
          <StarForkRatioCard repo={repo} />
          <ReadmeQualityCard repo={repo} />
          <div className="hidden lg:block" />
        </div>
      )}
      {hasDeepStats && <LaunchReadinessCard repo={repo} />}
      <TopicTags repo={repo} onTopic={onTopic} />
    </>
  );
}

/* ---------- table ---------- */
export function RepoTable({
  repos,
  advanced = true,
  onTopic,
}: {
  repos: RepoTraffic[];
  advanced?: boolean;
  onTopic?: (t: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("clones");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [compare, setCompare] = useState<[RepoTraffic, RepoTraffic] | null>(null);
  const [exportExpand, setExportExpand] = useState(false);

  useEffect(() => {
    const expand = () => setExportExpand(true);
    const restore = () => setExportExpand(false);
    window.addEventListener("gitlytics-export-expand", expand);
    window.addEventListener("gitlytics-export-restore", restore);
    return () => {
      window.removeEventListener("gitlytics-export-expand", expand);
      window.removeEventListener("gitlytics-export-restore", restore);
    };
  }, []);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setDir("desc");
    }
  }

  function togglePin(name: string) {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleSelect(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 2) return prev;
      const next = [...prev, name];
      if (next.length === 2) {
        const a = repos.find((r) => r.repository === next[0]);
        const b = repos.find((r) => r.repository === next[1]);
        if (a && b) setCompare([a, b]);
      }
      return next;
    });
  }

  const sorted = useMemo(() => {
    const acc = accessor[sortKey];
    const base = [...repos].sort((a, b) => (dir === "desc" ? acc(b) - acc(a) : acc(a) - acc(b)));
    const pin = base.filter((r) => pinned.has(r.repository));
    const rest = base.filter((r) => !pinned.has(r.repository));
    return [...pin, ...rest];
  }, [repos, sortKey, dir, pinned]);

  const visibleCols = advanced ? COLUMNS : COLUMNS.filter((c) => c.key === "stars" || c.key === "views" || c.key === "clones");
  const colCount = advanced ? 9 : 5;

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h3 className="text-sm font-semibold">All Repositories</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {selectMode ? "Select exactly 2 repositories to compare" : "Click a row to expand deep-dive analytics"}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectMode((s) => !s);
            setSelected([]);
            setCompare(null);
          }}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg border border-input px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] ${
            selectMode ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "bg-background/40 hover:bg-foreground/5"
          }`}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {selectMode ? "Cancel" : "Compare"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Repository</th>
              {visibleCols.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium" title={c.tip}>
                  <button
                    onClick={() => toggleSort(c.key)}
                    className={`ml-auto flex items-center gap-1 transition-colors hover:text-foreground ${
                      sortKey === c.key ? "text-primary" : ""
                    }`}
                  >
                    <c.icon className="h-3.5 w-3.5" />
                    {c.label}
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                    {sortKey === c.key && <span className="text-[10px]">{dir === "desc" ? "↓" : "↑"}</span>}
                  </button>
                </th>
              ))}
              {advanced && (
                <th
                  className="px-4 py-3 text-right font-medium"
                  title="Compares last 7 days vs previous 7 days"
                >
                  Momentum
                </th>
              )}
              <th className="hidden px-4 py-3 text-right font-medium lg:table-cell">Top Referrer</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <RepoRow
                key={r.repository}
                repo={r}
                defaultOpen={!selectMode && i === 0}
                forceOpen={exportExpand}
                pinned={pinned.has(r.repository)}
                onTogglePin={() => togglePin(r.repository)}
                selectMode={selectMode}
                selected={selected.includes(r.repository)}
                onToggleSelect={() => toggleSelect(r.repository)}
                selectDisabled={selected.length >= 2}
                advanced={advanced}
                onTopic={onTopic}
              />
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-muted-foreground">
                  No repositories match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {compare && (
        <CompareModal
          repoA={compare[0]}
          repoB={compare[1]}
          onClose={() => {
            setCompare(null);
            setSelected([]);
            setSelectMode(false);
          }}
        />
      )}
    </div>
  );
}

export type { SortKey };
