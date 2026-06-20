import { Clock } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { bestTimeToPost } from "@/lib/analytics";

export function BestTimeCard({ repos }: { repos: RepoTraffic[] }) {
  const t = bestTimeToPost(repos);
  return (
    <div className="glass gradient-border animate-slide-up flex items-start gap-3 rounded-xl p-4">
      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-sm text-muted-foreground">
        Your audience is most active on{" "}
        <span className="font-semibold text-primary">{t.long}</span> — consider releasing
        new versions on {t.long} for maximum reach.
      </p>
    </div>
  );
}
