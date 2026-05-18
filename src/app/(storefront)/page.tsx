import { HomeSectionRenderer } from "@/modules/home/components/home-section-renderer";
import { GetHomepageContentUseCase } from "@/server/application/content/get-homepage-content.use-case";
import { PrismaHomepageContentRepository } from "@/server/infrastructure/database/repositories/prisma-homepage-content.repository";

export default async function HomePage() {
  const homepageContentRepository =
    new PrismaHomepageContentRepository();

  const getHomepageContentUseCase =
    new GetHomepageContentUseCase(homepageContentRepository);

  const sections = await getHomepageContentUseCase.execute();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <HomeSectionRenderer sections={sections} />
    </main>
  );
}