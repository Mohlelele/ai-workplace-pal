import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  recipient: z.string().min(1).max(200),
  purpose: z.string().min(1).max(1000),
  context: z.string().max(2000).optional().default(""),
  tone: z.enum(["formal", "friendly", "persuasive"]),
});

const PlanInput = z.object({
  goal: z.string().min(1).max(1000),
  period: z.enum(["daily", "weekly"]),
  priority: z.enum(["high", "medium", "low"]),
  hours: z.string().min(1).max(20),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { runGeneration, buildEmailPrompt } = await import("./ai.server");
    return runGeneration(buildEmailPrompt(data));
  });

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const { runGeneration, buildPlanPrompt } = await import("./ai.server");
    return runGeneration(buildPlanPrompt(data));
  });
