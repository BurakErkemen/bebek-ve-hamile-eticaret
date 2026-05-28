import { unstable_cache } from "next/cache";
import { PrismaSiteSettingRepository } from "@/server/infrastructure/database/repositories/prisma-site-setting.repository";
import { GetSiteSettingsUseCase } from "@/server/application/admin/settings/site-setting.use-cases";
import type { SiteSettingsMap } from "@/server/domain/entities/site-setting.entity";

export const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsMap> => {
    const repo = new PrismaSiteSettingRepository();
    return new GetSiteSettingsUseCase(repo).execute();
  },
  ["site-settings"],
  { revalidate: 300, tags: ["site-settings"] },
);
