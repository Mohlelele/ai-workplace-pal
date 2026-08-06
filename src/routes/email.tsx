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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly, or persuasive tone, then edit, copy, or regenerate the draft.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-drafted workplace emails in three tones — editable, copyable, session-only.",
      },
    ],
  }),
  component: EmailGenerator,
});

type Tone = "formal" | "friendly" | "persuasive";

function EmailGenerator() {
  const runGenerate = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Add a recipient and a purpose first.");
      return;
    }
    setLoading(true);
    try {
      const result = await runGenerate({
        data: { recipient, purpose, context, tone },
      });
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
      <TopBar title="Smart Email Generator" subtitle="Professional emails in three tones" />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-5 px-4 py-6 md:px-6 md:py-8">
        <DisclaimerNotice />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Email details</CardTitle>
              <CardDescription>Tell the assistant who it's for and what it needs to say.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="e.g. my manager, the finance team, a new client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  placeholder="e.g. request a deadline extension"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="context">Additional context</Label>
                <Textarea
                  id="context"
                  rows={5}
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                  placeholder="Any background, constraints, or points to include. Avoid confidential details."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as Tone)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={generate} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {loading ? "Generating…" : "Generate email"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Draft</CardTitle>
              <CardDescription>Edit freely, then copy it into your mail client.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneratedOutput
                value={output}
                onChange={setOutput}
                onRegenerate={generate}
                loading={loading}
                label="Email draft"
                emptyHint="Your generated email will appear here."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
