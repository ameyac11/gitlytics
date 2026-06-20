import { Home, BookOpen } from "lucide-react";

export function TopNavPills({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <a
        href="https://gitlytics.dev"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center rounded-lg border border-input bg-background/40 p-1.5 text-muted-foreground transition-all hover:scale-[1.02] hover:bg-foreground/5 hover:text-foreground"
        title="Gitlytics Home"
      >
        <Home className="h-4 w-4" />
      </a>
      <a
        href="https://docs.gitlytics.dev"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 rounded-lg border border-input bg-background/40 px-3 py-1.5 text-xs font-medium transition-all hover:scale-[1.02] hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
      >
        <BookOpen className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Docs</span>
      </a>
    </div>
  );
}
