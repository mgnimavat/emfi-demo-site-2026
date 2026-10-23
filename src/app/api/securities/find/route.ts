import { NextResponse } from "next/server";
import { findSecurityReference, validSecurityIsin } from "@/lib/security-reference";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Enter a valid security search." }, { status: 400, headers });
  }
  if (!validSecurityIsin(body?.isin)) return NextResponse.json({ error: "Enter a valid 12-character ISIN." }, { status: 400, headers });
  const key = process.env.EMFI_SECURITIES_API_KEY;
  if (!key) return NextResponse.json({ error: "Security lookup is temporarily unavailable. Please try again later." }, { status: 503, headers });
  try {
    const result = await findSecurityReference(body.isin, key, request.signal);
    return result ? NextResponse.json({ data: result }, { headers }) : NextResponse.json({ error: "No security found for this ISIN. Check the code and try again." }, { status: 404, headers });
  } catch {
    return NextResponse.json({ error: "Could not retrieve security details. Please try again." }, { status: 502, headers });
  }
}
