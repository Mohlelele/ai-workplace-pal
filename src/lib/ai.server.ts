import { streamText } from "ai";

import {
  createLovableResponsesProvider,
  DEFAULT_MODEL,
  RESPONSES_PROVIDER_OPTIONS,
} from "./ai-gateway.server";

const TONE_GUIDES = {
  formal: "Formal: polished, respectful, precise, no contractions or slang.",
  friendly: "Friendly: warm, approachable, conversational but still professional.",
  persuasive: "Persuasive: confident, benefit-led, with a clear call to action.",
} as const;

export function buildEmailPrompt(input: {
  recipient: string;
  purpose: string;
  context: string;
  tone: "formal" | "friendly" | "persuasive";
}) {
  return {
    system:
      "You are an expert workplace communication assistant. You write clear, concise, ready-to-send business emails. Never invent specific facts, figures, names, or commitments that were not provided; use neutral placeholders in [square brackets] instead.",
    prompt: [
      "Write one professional workplace email.",
      "",
      `Recipient: ${input.recipient}`,
      `Purpose: ${input.purpose}`,
      `Additional context: ${input.context || "none provided"}`,
      `Tone: ${TONE_GUIDES[input.tone]}`,
      "",
      "Output format (plain text, no markdown fences):",
      "Subject: <concise subject line>",
      "",
      "<greeting>",
      "<2-4 short paragraphs>",
      "<sign-off and [Your Name]>",
      "",
      "Keep it under 220 words. Output only the email.",
    ].join("\n"),
  };
}

export function buildPlanPrompt(input: {
  goal: string;
  period: "daily" | "weekly";
  priority: "high" | "medium" | "low";
  hours: string;
}) {
  return {
    system:
      "You are an expert work planner. You build realistic, time-boxed schedules that respect the stated available hours and priority level. Never exceed the available working hours.",
    prompt: [
      `Create a ${input.period} work schedule.`,
      "",
      `Goal: ${input.goal}`,
      `Planning period: ${input.period}`,
      `Overall priority of this goal: ${input.priority}`,
      `Available working hours: ${input.hours} ${input.period === "weekly" ? "per week" : "per day"}`,
      "",
      "Output format (markdown, no code fences):",
      input.period === "daily"
        ? "- A single day broken into time blocks (e.g. 09:00-10:30), each with a task, a priority tag (High/Medium/Low) and an estimated duration."
        : "- One section per working day (Monday-Friday), each with time blocks, task, priority tag (High/Medium/Low) and estimated duration.",
      "- Order work so High priority items land in peak focus time.",
      "- Include short breaks and a brief 'Notes' section with 2-3 practical tips at the end.",
      "",
      "Total planned work time must fit the available hours. Output only the schedule.",
    ].join("\n"),
  };
}

export async function runGeneration({ system, prompt }: { system: string; prompt: string }) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return { text: "", error: "AI is not configured for this project yet." };
  }

  const { provider } = createLovableResponsesProvider(apiKey);

  try {
    const result = streamText({
      model: provider.responses(DEFAULT_MODEL),
      system,
      prompt,
      providerOptions: RESPONSES_PROVIDER_OPTIONS,
    });

    const text = await result.text;
    if (!text.trim()) {
      return { text: "", error: "The AI returned an empty response. Try regenerating." };
    }
    return { text, error: null as string | null };
  } catch (error) {
    console.error("Lovable AI generation failed", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) {
      return { text: "", error: "Too many requests right now. Please wait a moment and retry." };
    }
    if (message.includes("402")) {
      return { text: "", error: "AI credits are exhausted. Add credits to keep generating." };
    }
    return { text: "", error: "The AI request failed. Please try again." };
  }
}
