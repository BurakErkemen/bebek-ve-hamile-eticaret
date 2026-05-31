import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteThemeStyle } from "@/components/layout/site-theme-style";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Dastini — Bebek & Hamile Giyim | Bodrum Oasis",
    template: "%s | Dastini",
  },
  description:
    "Bodrum Oasis AVM'nin sevilen mağazası Dastini, bebek giyim ve hamile modasını online'a taşıyor.",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <SiteThemeStyle />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} min-h-screen bg-surface font-sans text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
