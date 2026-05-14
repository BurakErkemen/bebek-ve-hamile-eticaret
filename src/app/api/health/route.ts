import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "bebek-ve-hamile-eticaret",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
    },
  );
}