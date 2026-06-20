import { useEffect, useState } from "react";
import { Search, Download, RefreshCw, SlidersHorizontal, CalendarDays, ImageDown, FileText, IdCard, BarChart3, Zap, X } from "lucide-react";
import type { RangeKey } from "@/lib/analytics";
import type { ExportKind } from "@/lib/exports";
import { RepoFilter } from "./RepoFilter";

function ProgressBar() {
  return (
    <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-primary/15">
      <div className="gitlytics-indeterminate h-full w-1/3 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
    </div>
  );
}

const RANGES: RangeKey[] = ["7D", "14D", "30D", "90D", "Custom"];

export type ViewMode = "basic" | "advanced";

export function DashboardToolbar({
  query,
  setQuery,
  topN,
  setTopN,
  maxN,
  range,
  setRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  onDownload,
  onExportPng,
  onExportPdf,
  onCreateCard,
  onReload,
  reloading,
  canReload,
  viewMode,
  setViewMode,
  topic,
  onClearTopic,
  showCsv = true,
  allRepos = [],
  selectedRepos = [],
  onSelectedReposChange,
  searchRef,
}: {
  query: string;
  setQuery: (v: string) => void;
  topN: number;
  setTopN: (v: number) => void;
  maxN: number;
  range: RangeKey;
  setRange: (v: RangeKey) => void;
  customFrom: string;
  setCustomFrom: (v: string) => void;
  customTo: string;
  setCustomTo: (v: string) => void;
  onDownload: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onCreateCard: () => void;
  onReload: () => void;
  reloading: boolean;
  canReload: boolean;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  topic?: string | null;
  onClearTopic?: () => void;
  showCsv?: boolean;
  allRepos?: string[];
  selectedRepos?: string[];
  onSelectedReposChange?: (next: string[]) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [busy, setBusy] = useState<Record<ExportKind, boolean>>({
    csv: false,
    png: false,
    pdf: false,
    card: false,
  });

  useEffect(() => {
    function onEvt(e: Event) {
      const d = (e as CustomEvent<{ kind: ExportKind; busy: boolean }>).detail;
      if (!d) return;
      setBusy((b) => ({ ...b, [d.kind]: d.busy }));
    }
    window.addEventListener("gitlytics-export-busy", onEvt);
    return () => window.removeEventListener("gitlytics-export-busy", onEvt);
  }, []);

  function handleCsv() {
    setBusy((b) => ({ ...b, csv: true }));
    try {
      onDownload();
    } finally {
      window.setTimeout(() => setBusy((b) => ({ ...b, csv: false })), 800);
    }
  }
  function handlePng() {
    onExportPng();
  }
  function handleCard() {
    onCreateCard();
  }
  return (
    <div className="glass gradient-border animate-slide-up flex flex-col gap-4 rounded-xl p-4">
      {/* Row 1 — Search + Repo filter + Top N */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter repositories…"
            className="w-full rounded-lg border border-input bg-background/60 py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {onSelectedReposChange && allRepos.length > 0 && (
          <RepoFilter
            allRepos={allRepos}
            selected={selectedRepos}
            onChange={onSelectedReposChange}
          />
        )}

        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/30 px-3 py-1.5">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">Top N</span>
          <input
            type="range"
            min={1}
            max={Math.max(maxN, 1)}
            value={Math.min(topN, Math.max(maxN, 1))}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-border accent-primary sm:w-36"
          />
          <span className="w-7 text-center text-sm font-semibold tabular-nums text-primary">{topN}</span>
        </div>
      </div>

      {/* Row 2 — Action buttons */}
      <div className="flex flex-wrap items-stretch justify-end gap-2 border-t border-border/60 pt-3">
          {showCsv && (
            <div className="flex flex-col">
              <button
                onClick={handleCsv}
                className="flex items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
              {busy.csv && <ProgressBar />}
            </div>
          )}
          <div className="flex flex-col">
            <button
              onClick={handlePng}
              className="flex items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5"
            >
              <ImageDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export PNG</span>
              <span className="sm:hidden">PNG</span>
            </button>
            {busy.png && <ProgressBar />}
          </div>
          <div className="flex flex-col">
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            {busy.pdf && <ProgressBar />}
          </div>
          <div className="flex flex-col">
            <button
              onClick={handleCard}
              className="flex items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5"
            >
              <IdCard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Create Card</span>
              <span className="sm:hidden">Card</span>
            </button>
            {busy.card && <ProgressBar />}
          </div>
          {canReload && (
            <button
              onClick={onReload}
              disabled={reloading}
              className="flex h-fit items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${reloading ? "animate-spin" : ""}`} />
              Reload
            </button>
          )}
      </div>

      {/* Row 3 — View mode + Date range */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">

        <div className="flex items-center gap-1.5 rounded-lg bg-surface/60 p-1 ring-1 ring-border">
          <button
            onClick={() => setViewMode("basic")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === "basic" ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Basic
          </button>
          <button
            onClick={() => setViewMode("advanced")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === "advanced" ? "bg-primary/15 text-primary ring-1 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="h-3.5 w-3.5" /> Advanced
          </button>
        </div>

        {topic && (
          <button
            onClick={onClearTopic}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/25 hover:bg-primary/15"
            title="Click to clear topic filter"
          >
            topic: {topic}
            <X className="h-3 w-3" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap text-xs text-muted-foreground">Date Range</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition-all hover:scale-[1.02] ${
                range === r
                  ? "bg-primary/15 text-primary ring-primary/30"
                  : "bg-background/40 text-muted-foreground ring-border hover:bg-foreground/5"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {range === "Custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-input bg-background/60 px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-input bg-background/60 px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}
      </div>
    </div>
  );
}
