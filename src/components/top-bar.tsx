import { ShieldAlert } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="hidden h-6 sm:block" />
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>
        {subtitle && (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p>
        )}
      </div>
      <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-warning px-3 py-1.5 text-[11px] font-medium text-warning-foreground lg:flex">
        <ShieldAlert className="size-3.5" />
        Review AI output — never enter confidential data
      </span>
    </header>
  );
}
