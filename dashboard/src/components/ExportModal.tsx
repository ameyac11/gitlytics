import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ImageDown, FileText, Check } from "lucide-react";
import { runPngExport, runPdfExport } from "@/lib/exports";
import type { CardProfile } from "./CardModal";

const PNG_SECTIONS: { id: string; label: string; default: boolean }[] = [
  { id: "section-hero", label: "Lifetime Stats Hero Card", default: true },
  { id: "section-issues-prs", label: "Issues and PRs Summary Card", default: true },
  { id: "section-stat-cards", label: "6 Stat Cards", default: true },
  { id: "section-top10-charts", label: "Top 10 Charts", default: true },
  { id: "section-referrer-aggregation", label: "Global Referrer Aggregation", default: false },
  { id: "section-heatmap", label: "Traffic Patterns Heatmap", default: false },
  { id: "section-languages", label: "Language Distribution", default: false },
  { id: "section-commits", label: "Commit Activity", default: false },
  { id: "section-most-cloned", label: "Most Cloned Repositories Table", default: false },
  { id: "section-all-repos", label: "All Repositories Table", default: true },
];

export function ExportModal({
  onClose,
  mode = "png",
  allRepos,
  defaultRepos,
  runWithRepos,
  profile,
}: {
  onClose: () => void;
  mode?: "png" | "pdf";
  allRepos: string[];
  defaultRepos: string[];
  runWithRepos: (repos: string[], fn: () => Promise<void>) => Promise<void>;
  profile?: CardProfile;
}) {
  const [busy, setBusy] = useState(false);
  // Only show sections that actually exist in the current view (basic/advanced,
  // username vs live-api vs csv all render different subsets of these ids).
  const availableSections = useMemo(
    () =>
      typeof document === "undefined"
        ? PNG_SECTIONS
        : PNG_SECTIONS.filter((s) => document.getElementById(s.id) !== null),
    [],
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(availableSections.map((s) => [s.id, s.default])),
  );
  useEffect(() => {
    setChecked(Object.fromEntries(availableSections.map((s) => [s.id, s.default])));
  }, [availableSections]);
  const initial = defaultRepos.length > 0 && defaultRepos.length < allRepos.length
    ? defaultRepos
    : allRepos;
  const [repos, setRepos] = useState<string[]>(initial);

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  const anySelected = mode === "pdf" ? true : Object.values(checked).some(Boolean);
  const allReposSelected = repos.length === allRepos.length;

  const repoLabel = useMemo(() => {
    if (allReposSelected) return "All repos";
    if (repos.length === 1) return repos[0];
    return `${repos.length} repos`;
  }, [repos, allReposSelected]);

  function toggleRepo(r: string) {
    setRepos((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  }
  function toggleAllRepos() {
    setRepos(allReposSelected ? [] : allRepos);
  }

  async function exportNow() {
    if (repos.length === 0) return;
    setBusy(true);
    try {
      const reposParam = allReposSelected ? [] : repos;
      await runWithRepos(reposParam, async () => {
        if (mode === "png") {
          const ids = availableSections.filter((s) => checked[s.id]).map((s) => s.id);
          if (ids.length === 0) return;
          await runPngExport(ids, repoLabel, profile);
        } else {
          await runPdfExport(repoLabel, profile);
        }
      });
      onClose();
    } catch {
      /* toast handled */
    } finally {
      setBusy(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md"
      onClick={() => !busy && onClose()}
    >
      <div
        className="glass animate-slide-up flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold">
              {mode === "png" ? "Export PNG" : "Export PDF"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {mode === "png"
                ? "Choose repositories and sections to include"
                : "Choose repositories to include in the full report"}
            </p>
          </div>
          <button
            onClick={() => !busy && onClose()}
            aria-label="Close"
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Repositories ({repos.length}/{allRepos.length})
              </p>
              <button
                onClick={toggleAllRepos}
                className="text-xs font-medium text-primary hover:underline"
              >
                {allReposSelected ? "Clear all" : "Select all"}
              </button>
            </div>
            <div className="max-h-40 space-y-1 overflow-auto rounded-lg border border-border/60 bg-background/30 p-2">
              {allRepos.map((r) => {
                const on = repos.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => toggleRepo(r)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-foreground/5"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "border-input"
                        }`}
                    >
                      {on && <Check className="h-3 w-3" />}
                    </span>
                    <span className="truncate">{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "png" && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sections
              </p>
              {availableSections.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No exportable sections in the current view.
                </p>
              )}
              {availableSections.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border/60 bg-background/30 px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                >
                  <input
                    type="checkbox"
                    checked={checked[s.id]}
                    onChange={() => toggle(s.id)}
                    className="h-4 w-4 cursor-pointer accent-primary"
                  />
                  {s.label}
                </label>
              ))}
            </div>
          )}
          <button
            onClick={exportNow}
            disabled={busy || !anySelected || repos.length === 0}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {mode === "png" ? <ImageDown className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            {busy ? "Generating…" : mode === "png" ? "Export PNG" : "Export PDF"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
