import { prisma } from "@/server/infrastructure/database/prisma/prisma-client";
import type { SiteSettingRepository } from "@/server/domain/repositories/site-setting.repository";
import type { SiteSettingsMap } from "@/server/domain/entities/site-setting.entity";

export class PrismaSiteSettingRepository implements SiteSettingRepository {
  async getAll(): Promise<SiteSettingsMap> {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async upsertMany(settings: Record<string, string>): Promise<void> {
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
  }
}
