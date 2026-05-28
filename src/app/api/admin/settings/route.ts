import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { PrismaSiteSettingRepository } from "@/server/infrastructure/database/repositories/prisma-site-setting.repository";
import { GetSiteSettingsUseCase, SaveSiteSettingsUseCase } from "@/server/application/admin/settings/site-setting.use-cases";

export async function GET() {
  const repo = new PrismaSiteSettingRepository();
  const settings = await new GetSiteSettingsUseCase(repo).execute();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const settings: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") settings[key] = value;
  }
  const repo = new PrismaSiteSettingRepository();
  await new SaveSiteSettingsUseCase(repo).execute(settings);
  revalidateTag("site-settings", {});
  return NextResponse.json({ success: true });
}
