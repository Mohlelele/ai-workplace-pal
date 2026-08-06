import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLovableResponsesProvider,
  DEFAULT_MODEL,
  getLovableAiGatewayRunId,
  getLovableAiGatewayResponseHeaders,
  RESPONSES_PROVIDER_OPTIONS,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = [
  "You are the AI Workplace Productivity Assistant — a pragmatic assistant for professionals.",
  "You help with workplace writing, planning, prioritisation, meeting prep, summaries and process questions.",
  "Be concise and structured: short paragraphs, bullet lists, bold labels where helpful.",
  "Never invent specific facts, numbers or names; use [placeholders] when details are unknown.",
  "Remind the user to avoid sharing confidential information if they appear to be pasting sensitive data.",
].join(" ");

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("AI is not configured for this project.", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const { provider, runIdFetch } = createLovableResponsesProvider(apiKey, initialRunId);

        const result = streamText({
          model: provider.responses(DEFAULT_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages as UIMessage[]),
          providerOptions: RESPONSES_PROVIDER_OPTIONS,
        });

        const response = result.toUIMessageStreamResponse({
          sendReasoning: false,
          originalMessages: body.messages as UIMessage[],
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, runIdFetch);
      },
    },
  },
});
