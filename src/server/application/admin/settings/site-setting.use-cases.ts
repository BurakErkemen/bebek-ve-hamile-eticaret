import type { SiteSettingRepository } from "@/server/domain/repositories/site-setting.repository";

export class GetSiteSettingsUseCase {
  constructor(private readonly repo: SiteSettingRepository) {}
  execute() { return this.repo.getAll(); }
}

export class SaveSiteSettingsUseCase {
  constructor(private readonly repo: SiteSettingRepository) {}
  execute(settings: Record<string, string>) { return this.repo.upsertMany(settings); }
}
