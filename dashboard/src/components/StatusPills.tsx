import { Flame, Sparkles, Pin } from "lucide-react";

const base =
  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border";

export function TrendingPill() {
  return (
    <span className={`${base} bg-primary/10 text-primary border-primary/25`}>
      <Flame className="h-3 w-3" />
      Trending
    </span>
  );
}

export function NewPill() {
  return (
    <span className={`${base} bg-success/10 text-success border-success/25`}>
      <Sparkles className="h-3 w-3" />
      New
    </span>
  );
}

export function PinnedPill() {
  return (
    <span className={`${base} bg-chart-2/10 text-chart-2 border-chart-2/25`}>
      <Pin className="h-3 w-3" />
      Pinned
    </span>
  );
}
