import { CategoryShowcase } from "@/modules/home/components/category-showcase";
import { HeroSlider } from "@/modules/home/components/hero-slider";
import { ProductShowcase } from "@/modules/home/components/product-showcase";
import { PromoBanner } from "@/modules/home/components/promo-banner";
import type { HomeSection } from "@/modules/home/types/home-section.types";

type HomeSectionRendererProps = {
  sections: HomeSection[];
};

export function HomeSectionRenderer({
  sections,
}: HomeSectionRendererProps) {
  const activeSections = sections
    .filter((section) => section.isActive)
    .sort((firstSection, secondSection) => {
      return firstSection.sortOrder - secondSection.sortOrder;
    });

  return (
    <>
      {activeSections.map((section) => {
        switch (section.type) {
          case "hero-slider":
            return (
              <HeroSlider
                key={section.id}
                slides={section.content.slides}
              />
            );

          case "category-showcase":
            return (
              <CategoryShowcase
                key={section.id}
                title={section.title}
                description={section.description}
                categories={section.content.categories}
              />
            );

          case "promo-banner":
            return (
              <PromoBanner
                key={section.id}
                banner={section.content.banner}
              />
            );

          case "product-showcase":
            return (
              <ProductShowcase
                key={section.id}
                eyebrow={section.eyebrow}
                title={section.title ?? "Ürünler"}
                description={section.description}
                actionLabel={section.actionLabel}
                actionHref={section.actionHref}
                products={section.content.products}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}