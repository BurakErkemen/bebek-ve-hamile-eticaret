export type SiteSetting = {
  key: string;
  value: string;
};

export type SiteSettingsMap = Record<string, string>;

export const SETTING_KEYS = {
  FOOTER_EMAIL: "footer_email",
  FOOTER_PHONE: "footer_phone",
  FOOTER_ADDRESS: "footer_address",
  SOCIAL_INSTAGRAM: "social_instagram",
  SOCIAL_FACEBOOK: "social_facebook",
  SOCIAL_TIKTOK: "social_tiktok",
  SOCIAL_YOUTUBE: "social_youtube",
  SOCIAL_TWITTER: "social_twitter",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];
