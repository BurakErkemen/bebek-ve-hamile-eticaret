import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import { SiteThemeStyle } from "@/components/layout/site-theme-style";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bebek ve Hamile Giyim",
    template: "%s | Bebek ve Hamile Giyim",
  },
  description:
    "Bebek giyim, hamile giyim ve anne-bebek ürünlerinde modern alışveriş deneyimi.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr">
      <head>
        <SiteThemeStyle />
      </head>
      <body
        className={`${inter.variable} ${quicksand.variable} min-h-screen bg-brand-surface font-sans text-brand-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}