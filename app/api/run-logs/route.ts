import { NextRequest, NextResponse } from "next/server";

import { listRunLogs } from "../../../lib/automations";

export async function GET(request: NextRequest) {
  const automationId = request.nextUrl.searchParams.get("automationId") ?? undefined;
  const logs = listRunLogs(automationId);
  return NextResponse.json(logs);
}
