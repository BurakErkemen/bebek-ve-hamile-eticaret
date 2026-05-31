import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartDrawer } from "@/modules/cart/components/cart-drawer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { GSAPProvider } from "@/components/providers/gsap-provider";
import { getShippingConfig } from "@/server/application/layout/get-shipping-config.cached";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default async function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  const shippingConfig = await getShippingConfig();

  return (
    <SmoothScrollProvider>
      <GSAPProvider>
        <div className="flex min-h-screen flex-col">
          <AnnouncementBar freeShippingThreshold={shippingConfig.freeThreshold} />
          <Header />

          <div className="flex-1">{children}</div>

          <Footer />
          <CartDrawer />
          <CookieBanner />
        </div>
      </GSAPProvider>
    </SmoothScrollProvider>
  );
}