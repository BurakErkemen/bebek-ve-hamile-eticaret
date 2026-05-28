import { SETTING_KEYS } from "@/server/domain/entities/site-setting.entity";
import { getCachedSiteSettings } from "@/server/application/layout/get-site-settings.cached";
import { parseShippingConfig, type ShippingConfig } from "@/shared/utils/shipping";

export async function getShippingConfig(): Promise<ShippingConfig> {
  const settings = await getCachedSiteSettings();

  return parseShippingConfig({
    fee: settings[SETTING_KEYS.SHIPPING_FEE],
    freeThreshold: settings[SETTING_KEYS.FREE_SHIPPING_THRESHOLD],
  });
}
