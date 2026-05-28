import { PrismaSiteSettingRepository } from "@/server/infrastructure/database/repositories/prisma-site-setting.repository";
import { GetSiteSettingsUseCase } from "@/server/application/admin/settings/site-setting.use-cases";
import SiteSettingsForm from "@/modules/admin/components/settings/site-settings-form";

export default async function AdminSettingsPage() {
  const repo = new PrismaSiteSettingRepository();
  const settings = await new GetSiteSettingsUseCase(repo).execute();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Ayarlar</h1>
        <p className="mt-0.5 text-sm text-gray-500">Site renkleri, footer iletişim bilgileri ve sosyal medya bağlantıları</p>
      </div>
      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
