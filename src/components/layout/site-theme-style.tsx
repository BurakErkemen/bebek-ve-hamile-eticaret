import { getCachedSiteSettings } from "@/server/application/layout/get-site-settings.cached";
import { THEME_COLORS, isValidHexColor } from "@/shared/theme/theme-colors";

export async function SiteThemeStyle() {
  const settings = await getCachedSiteSettings();

  const overrides = THEME_COLORS.flatMap((color) => {
    const value = settings[color.key];
    if (!value || !isValidHexColor(value)) return [];
    return [`  ${color.cssVar}: ${value};`];
  });

  if (overrides.length === 0) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: `:root {\n${overrides.join("\n")}\n}` }} />
  );
}
