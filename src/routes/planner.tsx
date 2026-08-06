import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DisclaimerNotice } from "@/components/disclaimer-notice";
import { GeneratedOutput } from "@/components/generated-output";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generatePlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a goal and your available working hours into a prioritised daily or weekly schedule you can edit and copy.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritised daily and weekly work schedules generated from your goal and hours.",
      },
    ],
  }),
  component: TaskPlanner,
});

type Period = "daily" | "weekly";
type Priority = "high" | "medium" | "low";

function TaskPlanner() {
  const runGenerate = useServerFn(generatePlan);
  const [goal, setGoal] = useState("");
  const [period, setPeriod] = useState<Period>("daily");
  const [priority, setPriority] = useState<Priority>("high");
  const [hours, setHours] = useState("6");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim() || !hours.trim()) {
      toast.error("Add a goal and your available working hours.");
      return;
    }
    setLoading(true);
    try {
      const result = await runGenerate({ data: { goal, period, priority, hours } });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setOutput(result.text);
    } catch {
      toast.error("Couldn't reach the AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="AI Task Planner" subtitle="Prioritised daily and weekly schedules" />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 px-4 py-6 md:px-6 md:py-8">
        <DisclaimerNotice />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Planning inputs</CardTitle>
              <CardDescription>Describe the goal and the time you actually have.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Textarea
                  id="goal"
                  rows={4}
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="e.g. Ship the Q3 reporting dashboard and prepare the stakeholder review"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="period">Planning period</Label>
                  <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                    <SelectTrigger id="period">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">
                  Available working hours {period === "weekly" ? "(per week)" : "(per day)"}
                </Label>
                <Input
                  id="hours"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  placeholder={period === "weekly" ? "e.g. 30" : "e.g. 6"}
                  inputMode="decimal"
                />
              </div>
              <Button onClick={generate} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {loading ? "Building schedule…" : "Generate schedule"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Your schedule</CardTitle>
              <CardDescription>Adjust the time blocks to match your real calendar.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratedOutput
                value={output}
                onChange={setOutput}
                onRegenerate={generate}
                loading={loading}
                rows={20}
                label="Schedule"
                emptyHint="Your generated schedule will appear here."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
