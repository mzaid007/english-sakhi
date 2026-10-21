import { NextResponse } from "next/server";

/**
 * Optional sync helper — primary sync runs client-side via Supabase + RLS.
 * Kept as a health/docs endpoint for Phase 2 architecture completeness.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message_hi: "सिंक ब्राउज़र में सुपाबेस से होता है।",
  });
}
