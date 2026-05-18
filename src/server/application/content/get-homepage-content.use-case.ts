import type { HomepageSectionEntity } from "@/server/domain/entities/homepage-section.entity";
import type { HomepageContentRepository } from "@/server/domain/repositories/homepage-content.repository";

export class GetHomepageContentUseCase {
  constructor(
    private readonly homepageContentRepository: HomepageContentRepository,
  ) {}

  async execute(): Promise<HomepageSectionEntity[]> {
    return this.homepageContentRepository.findActiveHomepageSections();
  }
}