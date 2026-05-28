import type { SiteSettingsMap } from "@/server/domain/entities/site-setting.entity";

export interface SiteSettingRepository {
  getAll(): Promise<SiteSettingsMap>;
  upsertMany(settings: Record<string, string>): Promise<void>;
}
