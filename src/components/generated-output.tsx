import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GeneratedOutputProps = {
  value: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  loading: boolean;
  emptyHint: string;
  rows?: number;
  label?: string;
};

export function GeneratedOutput({
  value,
  onChange,
  onRegenerate,
  loading,
  emptyHint,
  rows = 16,
  label = "Generated output",
}: GeneratedOutputProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copy}
            disabled={!value || loading}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            Copy
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Regenerate
          </Button>
        </div>
      </div>
      {value || loading ? (
        <Textarea
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          placeholder={loading ? "Generating…" : ""}
          className="resize-y whitespace-pre-wrap font-sans text-sm leading-relaxed"
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      )}
      {value && !loading && (
        <p className="text-xs text-muted-foreground">
          This output is fully editable — refine the wording before you use it.
        </p>
      )}
    </div>
  );
}
