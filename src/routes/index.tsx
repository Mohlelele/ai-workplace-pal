import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Mail, MessagesSquare, Sparkles } from "lucide-react";

import { DisclaimerNotice } from "@/components/disclaimer-notice";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "One workspace for AI-drafted emails, prioritised work schedules, and a workplace chatbot. No login and no saved data.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, plan your week, and chat with a work-focused AI assistant — session-only, no sign-up.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description:
      "Turn a recipient, purpose, and a little context into a ready-to-send email in a formal, friendly, or persuasive tone.",
    to: "/email",
    icon: Mail,
    cta: "Draft an email",
  },
  {
    title: "AI Task Planner",
    description:
      "Describe a goal and your available hours, and get a time-boxed daily or weekly schedule ordered by priority.",
    to: "/planner",
    icon: CalendarClock,
    cta: "Build a schedule",
  },
  {
    title: "AI Chatbot",
    description:
      "Ask anything work-related — summaries, rewrites, meeting prep, next steps. The conversation lasts for this session only.",
    to: "/chat",
    icon: MessagesSquare,
    cta: "Start chatting",
  },
] as const;

const tips = [
  "Be specific about the outcome you want — the more context, the sharper the output.",
  "Every result is editable: treat it as a strong first draft, not a final version.",
  "Use Regenerate to explore a different angle without retyping your inputs.",
  "Keep names, numbers, and client details out — replace them with placeholders.",
];

function Dashboard() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Your AI workspace for everyday work" />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8">
        <section className="overflow-hidden rounded-2xl border border-border bg-brand-soft px-6 py-8 shadow-[var(--shadow-card)] md:px-10 md:py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" />
            Session-only workspace
          </span>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold md:text-3xl">
            Get through workplace writing and planning faster.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Three focused AI tools for professionals: draft emails, plan prioritised schedules, and
            think out loud with a work-savvy assistant. No account, no database — everything
            disappears when you close the tab.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/email">
                Draft an email <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/planner">Plan my week</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.title} className="shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                  <tool.icon className="size-5" />
                </span>
                <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                <CardDescription className="leading-relaxed">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" size="sm">
                  <Link to={tool.to}>
                    {tool.cta} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Getting the best results</CardTitle>
              <CardDescription>Four habits that make AI output far more useful.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {tips.map((tip) => (
                  <li key={tip} className="flex gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Responsible use</CardTitle>
              <CardDescription>Please read before you share anything you generate.</CardDescription>
            </CardHeader>
            <CardContent>
              <DisclaimerNotice />
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
