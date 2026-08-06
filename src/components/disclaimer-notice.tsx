import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export const DISCLAIMER =
  "AI-generated content may contain inaccuracies. Always review and verify outputs before using them for professional or business purposes. Do not enter confidential or sensitive information.";

export function DisclaimerNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-border bg-warning px-4 py-3 text-xs leading-relaxed text-warning-foreground",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p>{DISCLAIMER}</p>
    </div>
  );
}
