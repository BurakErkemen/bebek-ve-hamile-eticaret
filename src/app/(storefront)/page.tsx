import { HomeSectionRenderer } from "@/modules/home/components/home-section-renderer";
import { getCachedHomepageContent } from "@/server/application/content/get-homepage-content.cached";

export default async function HomePage() {
  const sections = await getCachedHomepageContent();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <HomeSectionRenderer sections={sections} />
    </main>
  );
}
