const KEY = "gitlytics-export-history";

export type ExportAction = "Export PNG" | "Export PDF" | "Create Card" | "Download CSV";

export interface ExportLogEntry {
  timestamp: string; // ISO
  action: ExportAction;
  repos: string; // "All repos" | "@user" | "comma list"
  filename: string;
}

export function readHistory(): ExportLogEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as ExportLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendHistory(entry: Omit<ExportLogEntry, "timestamp"> & { timestamp?: string }) {
  if (typeof window === "undefined") return;
  const list = readHistory();
  list.unshift({ timestamp: new Date().toISOString(), ...entry });
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("gitlytics-export-history-updated"));
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("gitlytics-export-history-updated"));
  }
}

export function exportFilename(kind: "png" | "pdf" | "csv" | "card", username?: string): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  if (kind === "card") return `gitlytics-card-${username || "user"}-${stamp}.png`;
  if (kind === "csv") return `gitlytics-export-${stamp}.csv`;
  return `gitlytics-report-${stamp}.${kind}`;
}