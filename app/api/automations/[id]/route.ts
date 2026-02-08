import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteAutomation, getAutomation, updateAutomation } from "../../../../lib/automations";
import type { Automation } from "../../../../lib/types";

const updateSchema = z
  .object({
    name: z.string().optional(),
    persona: z.string().optional(),
    targetAudience: z.string().optional(),
    status: z.enum(["idle", "running", "scheduled", "error"]).optional(),
    schedule: z
      .object({
        frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "custom"]).optional(),
        nextRun: z.string().optional(),
        cadenceDescription: z.string().optional(),
        distributionChannels: z
          .array(z.enum(["YouTube", "TikTok", "Instagram", "LinkedIn", "Twitter"]))
          .optional()
      })
      .optional(),
    performance: z
      .object({
        views: z.number().optional(),
        watchTimeMinutes: z.number().optional(),
        engagements: z.number().optional(),
        conversionRate: z.number().optional()
      })
      .optional(),
    steps: z
      .array(
        z.object({
          id: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          requiresHumanReview: z.boolean().optional(),
          durationMinutes: z.number().optional(),
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
          configuration: z.record(z.any()).optional(),
          tools: z.array(z.string()).optional()
        })
      )
      .optional()
  })
  .strict();

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const automation = getAutomation(params.id);
  if (!automation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(automation);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const automation = updateAutomation(params.id, parsed.data as Partial<Automation>);
    return NextResponse.json(automation);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  deleteAutomation(params.id);
  return NextResponse.json({ ok: true });
}
