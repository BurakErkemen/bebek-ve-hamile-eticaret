import { CategoryShowcase } from "@/modules/home/components/category-showcase";
import { HeroSlider } from "@/modules/home/components/hero-slider";
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

          default:
            return null;
        }
      })}
    </>
  );
}