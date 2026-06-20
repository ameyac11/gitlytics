import type { ReferrerCategory } from "@/lib/analytics";
import { categorizeReferrer, CATEGORY_TINT } from "@/lib/analytics";

export function CategoryBadge({ referrer }: { referrer: string }) {
  const cat: ReferrerCategory = categorizeReferrer(referrer);
  return (
    <span
      className={`inline-flex items-center rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] font-medium border border-border ${CATEGORY_TINT[cat]}`}
    >
      {cat}
    </span>
  );
}
