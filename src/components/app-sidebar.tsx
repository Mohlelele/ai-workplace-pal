import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, CalendarClock, MessagesSquare, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Task Planner", url: "/planner", icon: CalendarClock },
  { title: "AI Chatbot", url: "/chat", icon: MessagesSquare },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (router) => router.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-lift)]">
            <Sparkles className="size-4" />
          </span>
          {!collapsed && (
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold">Workplace AI</span>
              <span className="text-xs text-muted-foreground">Productivity Assistant</span>
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter>
          <p className="rounded-lg bg-warning px-3 py-2 text-[11px] leading-relaxed text-warning-foreground">
            Session-only workspace. Nothing you type is saved — refreshing clears everything.
          </p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
