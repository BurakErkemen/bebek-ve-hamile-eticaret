import { HomeSectionRenderer } from "@/modules/home/components/home-section-renderer";
import { homeSections } from "@/modules/home/data/home-sections.mock";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <HomeSectionRenderer sections={homeSections} />
    </main>
  );
}