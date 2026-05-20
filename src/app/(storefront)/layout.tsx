import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartDrawer } from "@/modules/cart/components/cart-drawer";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />

      <div className="flex-1">{children}</div>

      <Footer />
      <CartDrawer />
    </div>
  );
}