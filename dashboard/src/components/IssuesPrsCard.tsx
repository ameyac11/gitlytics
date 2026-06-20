import { CircleDot, GitPullRequest } from "lucide-react";
import type { RepoTraffic } from "@/lib/github-api";
import { issuesPrsSummary } from "@/lib/analytics";
import { LanguagePill } from "./LanguagePill";

export function IssuesPrsCard({ repos }: { repos: RepoTraffic[] }) {
  const { totalIssues, totalPRs, rows } = issuesPrsSummary(repos);
  const sorted = [...rows].sort((a, b) => b.issues + b.prs - (a.issues + a.prs));

  return (
    <div className="glass gradient-border animate-slide-up rounded-xl">
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div
          className="flex items-center gap-3 p-5"
          title="Total number of open issues across all of your repositories"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <CircleDot className="h-5 w-5 text-primary" />
          </div>
          <p className="text-base leading-relaxed sm:text-lg">
            <span className="font-semibold text-primary">{totalIssues.toLocaleString()}</span> open
            issues across all repositories
          </p>
        </div>
        <div
          className="flex items-center gap-3 p-5"
          title="Total number of open pull requests across all of your repositories"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-chart-2/15 ring-1 ring-chart-2/30">
            <GitPullRequest className="h-5 w-5 text-chart-2" />
          </div>
          <p className="text-base leading-relaxed sm:text-lg">
            <span className="font-semibold text-chart-2">{(totalPRs ?? 0).toLocaleString()}</span> open pull
            requests across all repositories
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Repository</th>
              <th className="px-4 py-3 text-right font-medium">Open Issues</th>
              <th className="px-4 py-3 text-right font-medium">Open PRs</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.repo}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-foreground/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{r.repo}</span>
                    <LanguagePill repo={r.repo} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{r.issues}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{r.prs ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
