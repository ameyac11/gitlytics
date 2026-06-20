import { useMemo } from "react";

export function FreshnessPill({ fetchedAt, repo }: { fetchedAt?: string; repo?: string }) {
  const days = useMemo(() => {
    if (fetchedAt) {
      const d = (Date.now() - new Date(fetchedAt).getTime()) / 86_400_000;
      if (!isNaN(d)) return Math.max(0, Math.floor(d));
    }
    // deterministic pseudo-fallback for demo data
    let h = 0;
    const s = repo || "";
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % 14;
  }, [fetchedAt, repo]);

  let tone: "ok" | "warn" | "stale" = "ok";
  if (days >= 11) tone = "stale";
  else if (days >= 4) tone = "warn";

  const styles =
    tone === "ok"
      ? "bg-success/10 text-success ring-success/25"
      : tone === "warn"
        ? "bg-chart-2/10 text-chart-2 ring-chart-2/25"
        : "bg-destructive/10 text-destructive ring-destructive/25";
  const dot = tone === "ok" ? "🟢" : tone === "warn" ? "🟡" : "🔴";
  const label = tone === "ok" ? "Fresh" : tone === "warn" ? "Aging" : "Stale";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ${styles}`}
      title={`Data last updated ${days} day${days === 1 ? "" : "s"} ago. Sync again to get latest traffic stats.`}
    >
      <span className="text-[8px]">{dot}</span> {label}
    </span>
  );
}