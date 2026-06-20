import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS: [string, string][] = [
  ["E", "Open Export PNG modal"],
  ["B", "Toggle Basic / Advanced view"],
  ["R", "Reset all filters"],
  ["/", "Focus repository search"],
  ["Esc", "Close any open modal"],
  ["?", "Show this help"],
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts (?)"
        className="fixed bottom-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow backdrop-blur hover:text-primary"
      >
        <Keyboard className="h-4 w-4" />
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <div
              className="glass animate-slide-up w-full max-w-sm rounded-xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="text-sm font-semibold">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-2 p-5 text-sm">
                {SHORTCUTS.map(([k, label]) => (
                  <li key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <kbd className="rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-xs">
                      {k}
                    </kbd>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}