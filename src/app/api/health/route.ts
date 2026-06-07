import { NextResponse } from "next/server";
import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Veritabanı bağlantısını gerçekten doğrula
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        service: "bebek-ve-hamile-eticaret",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        service: "bebek-ve-hamile-eticaret",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
