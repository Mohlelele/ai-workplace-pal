import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Check, Copy, Loader2, Pencil, RefreshCw, SendHorizontal, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

import { DISCLAIMER, DisclaimerNotice } from "@/components/disclaimer-notice";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with a workplace AI assistant about writing, planning, and prioritising. The conversation lasts for this browser session only.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "A session-only workplace AI assistant with editable, copyable replies.",
      },
    ],
  }),
  component: ChatPage,
});

const suggestions = [
  "Summarise this week's priorities for a status update",
  "Rewrite my message so it sounds more diplomatic",
  "Help me prepare an agenda for a 30-minute team sync",
];

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

function ChatPage() {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages, regenerate, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (chatError) => {
      const message = chatError.message ?? "";
      if (message.includes("429")) toast.error("Too many requests — wait a moment and retry.");
      else if (message.includes("402")) toast.error("AI credits are exhausted. Add credits to continue.");
      else toast.error("The assistant couldn't respond. Please try again.");
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  const saveEdit = (id: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, parts: [{ type: "text" as const, text: draft }] } : message,
      ),
    );
    setEditingId(null);
    setDraft("");
  };

  return (
    <>
      <TopBar title="AI Chatbot" subtitle="Session-only workplace assistant" />
      <main className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-4xl flex-1 flex-col gap-4 overflow-hidden px-4 py-4 md:px-6 md:py-6">
        <DisclaimerNotice />

        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden py-0 shadow-[var(--shadow-card)]">
          <CardContent className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-soft text-primary">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold">How can I help with work today?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ask about writing, planning, prioritising, or preparing for meetings.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-brand-soft"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = messageText(message);
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary text-secondary-foreground",
                    )}
                  >
                    {editingId === message.id ? (
                      <div className="w-[min(70vw,32rem)] space-y-2">
                        <Textarea
                          value={draft}
                          rows={8}
                          onChange={(event) => setDraft(event.target.value)}
                          className="bg-background text-foreground"
                        />
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => saveEdit(message.id)}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : text ? (
                        <div className="space-y-2 [&_a]:underline [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol>li]:list-decimal [&_strong]:font-semibold">
                          <Markdown>{text}</Markdown>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Thinking…</span>
                      )
                    )}
                  </div>

                  {!isUser && text && editingId !== message.id && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => copy(message.id, text)}>
                        {copiedId === message.id ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(message.id);
                          setDraft(text);
                        }}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => regenerate({ messageId: message.id })}
                      >
                        <RefreshCw className="size-3.5" />
                        Regenerate
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            {error && (
              <p className="text-center text-xs text-destructive">
                The last request failed. Try sending your message again.
              </p>
            )}
            <div ref={bottomRef} />
          </CardContent>

          <div className="border-t border-border bg-background/80 px-4 py-3 md:px-6">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submit(input);
              }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={input}
                rows={1}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit(input);
                  }
                }}
                placeholder="Ask a work question… (Shift + Enter for a new line)"
                className="max-h-40 min-h-11 resize-none"
              />
              <Button type="submit" disabled={busy || !input.trim()} size="icon" className="size-11">
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <SendHorizontal className="size-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11"
                disabled={busy || messages.length === 0}
                onClick={() => {
                  setMessages([]);
                  setEditingId(null);
                }}
                aria-label="Clear conversation"
              >
                <Trash2 className="size-4" />
              </Button>
            </form>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
          </div>
        </Card>
      </main>
    </>
  );
}
