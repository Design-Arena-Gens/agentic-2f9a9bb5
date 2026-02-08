import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createAutomation,
  listAutomations
} from "../../../lib/automations";
import { Automation } from "../../../lib/types";

const createAutomationSchema = z.object({
  name: z.string().min(3),
  persona: z.string().min(10),
  targetAudience: z.string().min(5),
  primaryPlatform: z.enum(["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter"]),
  crossPost: z.array(z.enum(["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter"])),
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "custom"]),
  steps: z
    .array(
      z
        .object({
          id: z.string().optional(),
          type: z
            .enum([
              "ideation",
              "script",
              "recording",
              "editing",
              "thumbnail",
              "captions",
              "distribution",
              "analytics"
            ])
            .optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          requiresHumanReview: z.boolean().optional(),
          configuration: z.record(z.any()).optional(),
          durationMinutes: z.number().optional(),
          tools: z.array(z.string()).optional()
        })
        .strict()
    )
    .optional()
});

export const dynamic = "force-dynamic";

export async function GET() {
  const automations = listAutomations();
  return NextResponse.json<Automation[]>(automations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createAutomationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const automation = createAutomation(parsed.data);
  return NextResponse.json(automation, { status: 201 });
}
