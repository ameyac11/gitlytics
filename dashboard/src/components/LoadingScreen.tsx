import { useEffect, useRef, useState } from "react";
import { BarChart3 } from "lucide-react";

export function LoadingScreen({ label = "Connecting…", durationMs = 3000 }: { label?: string; durationMs?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - start;
      // Go up to 99% over the durationMs, it will immediately disappear when the parent unmounts it
      const p = Math.min(99, (elapsed / durationMs) * 100);
      setProgress(p);
    }, 100);
    return () => window.clearInterval(timer);
  }, [durationMs]);

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="mb-6 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <p className="text-base font-semibold tracking-tight">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">Crunching your repository traffic…</p>

        <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-surface ring-1 ring-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-medium tabular-nums text-primary">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
