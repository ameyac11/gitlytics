import { useEffect, useState } from "react";
import { ChevronDown, History, Trash2 } from "lucide-react";
import { readHistory, clearHistory, type ExportLogEntry } from "@/lib/export-history";

function fmt(ts: string) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

function relativeDaysAgo(ts: string) {
  const days = Math.floor((Date.now() - new Date(ts).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function ExportHistory() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ExportLogEntry[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(readHistory());
    refresh();
    window.addEventListener("gitlytics-export-history-updated", refresh);
    return () => window.removeEventListener("gitlytics-export-history-updated", refresh);
  }, []);

  const last = entries[0];

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <History className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold">Export History</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {last ? `Last export: ${relativeDaysAgo(last.timestamp)}` : "No exports yet"}
            </p>
          </div>
          <ChevronDown
            className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {entries.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearHistory();
            }}
            className="ml-3 flex items-center gap-1 rounded-md border border-input bg-background/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Clear export history"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {open && (
        <div className="animate-slide-up overflow-x-auto border-t border-border">
          {entries.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No exports yet. Use Download CSV, Export PNG, Export PDF, or Create Card to begin.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Repositories</th>
                  <th className="px-4 py-3 font-medium">File</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmt(e.timestamp)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/25">
                        {e.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.repos}</td>
                    <td className="px-4 py-3 font-mono text-xs">{e.filename}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}