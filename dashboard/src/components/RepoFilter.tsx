import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Folder } from "lucide-react";

const KEY = "gitlytics-repo-filter";

export function loadRepoFilter(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveRepoFilter(repos: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(repos));
  } catch {
    /* ignore */
  }
}

export function RepoFilter({
  allRepos,
  selected,
  onChange,
}: {
  allRepos: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(selected);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => setDraft(selected), [selected, open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (ref.current?.contains(t)) return;
      const panel = document.getElementById("gitlytics-repo-filter-panel");
      if (panel?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open || !btnRef.current) return;
    function update() {
      const r = btnRef.current!.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 256) });
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  const isAll = draft.length === 0 || draft.length === allRepos.length;

  function toggle(r: string) {
    setDraft((d) => {
      const set = new Set(d.length === 0 ? allRepos : d);
      if (set.has(r)) set.delete(r);
      else set.add(r);
      return [...set];
    });
  }

  function toggleAll() {
    setDraft(isAll ? [] : []); // empty means "all"
  }

  function apply() {
    const next = draft.length === allRepos.length ? [] : draft;
    onChange(next);
    setOpen(false);
  }

  const label =
    selected.length === 0
      ? "All repos"
      : selected.length === 1
        ? selected[0].split("/").pop() || selected[0]
        : `${selected.length} repos`;

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5"
      >
        <Folder className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Repos:</span> {label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && pos && createPortal(
        <div
          id="gitlytics-repo-filter-panel"
          style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
          className="glass z-[100] max-h-80 overflow-auto rounded-lg border border-border bg-background/95 p-2 text-sm shadow-xl backdrop-blur-xl"
        >
          <button
            onClick={toggleAll}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-foreground/5"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border ${
                isAll ? "border-primary bg-primary text-primary-foreground" : "border-input"
              }`}
            >
              {isAll && <Check className="h-3 w-3" />}
            </span>
            All repositories
          </button>
          <div className="my-1 h-px bg-border" />
          {allRepos.map((r) => {
            const checked = isAll || draft.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggle(r)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-foreground/5"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-input"
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className="truncate">{r}</span>
              </button>
            );
          })}
          <div className="mt-2 border-t border-border pt-2">
            <button
              onClick={apply}
              className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110"
            >
              Apply
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}