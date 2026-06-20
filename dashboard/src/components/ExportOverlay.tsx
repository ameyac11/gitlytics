import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Wordmark } from "./Wordmark";

interface State {
  open: boolean;
  kind?: string;
  steps: string[];
}

export function ExportOverlay() {
  const [state, setState] = useState<State>({ open: false, steps: [] });

  useEffect(() => {
    function onBusy(e: Event) {
      const d = (e as CustomEvent<{ kind: string; busy: boolean }>).detail;
      setState((s) =>
        d.busy
          ? { open: true, kind: d.kind, steps: [] }
          : { ...s, open: false, steps: [] },
      );
    }
    function onStep(e: Event) {
      const d = (e as CustomEvent<{ message: string }>).detail;
      setState((s) => ({ ...s, steps: [...s.steps, d.message] }));
    }
    window.addEventListener("gitlytics-export-busy", onBusy);
    window.addEventListener("gitlytics-export-step", onStep);
    return () => {
      window.removeEventListener("gitlytics-export-busy", onBusy);
      window.removeEventListener("gitlytics-export-step", onStep);
    };
  }, []);

  if (!state.open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <img
        src="/gitlytics-logo.png"
        alt=""
        className="h-20 w-20 animate-pulse object-contain"
      />
      <p className="mt-4 text-base font-semibold">
        <Wordmark /> <span className="text-muted-foreground">— preparing your export…</span>
      </p>
      <ul className="mt-5 min-h-[120px] space-y-1.5 text-center text-sm text-muted-foreground">
        {state.steps.map((s, i) => (
          <li key={i} className={i === state.steps.length - 1 ? "text-primary" : ""}>
            {s}
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
}