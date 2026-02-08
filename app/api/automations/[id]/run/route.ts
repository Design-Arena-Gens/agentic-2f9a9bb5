import { NextResponse } from "next/server";

import { runAutomation } from "../../../../../lib/automations";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const log = runAutomation(params.id);
    return NextResponse.json(log, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 404 });
  }
}
