export type ThemeColorDef = {
  key: string;
  cssVar: string;
  label: string;
  default: string;
};

export const THEME_COLORS: ThemeColorDef[] = [
  { key: "theme_primary", cssVar: "--brand-primary", label: "Ana Renk", default: "#e9a8b8" },
  { key: "theme_primary_dark", cssVar: "--brand-primary-dark", label: "Ana Renk (Koyu)", default: "#d9899d" },
  { key: "theme_secondary", cssVar: "--brand-secondary", label: "İkincil Renk", default: "#f7e8dc" },
  { key: "theme_accent", cssVar: "--brand-accent", label: "Vurgu Rengi", default: "#b7d7c4" },
  { key: "theme_surface", cssVar: "--brand-surface", label: "Arka Plan", default: "#fffaf7" },
  { key: "theme_text", cssVar: "--brand-text", label: "Metin Rengi", default: "#4a3f3a" },
  { key: "theme_muted", cssVar: "--brand-muted", label: "Soluk Metin", default: "#8d7e77" },
  { key: "theme_border", cssVar: "--brand-border", label: "Kenarlık", default: "#efdeda" },
];

const HEX_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHexColor(value: string): boolean {
  return HEX_PATTERN.test(value);
}
