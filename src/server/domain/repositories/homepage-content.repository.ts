import type { HomepageSectionEntity } from "@/server/domain/entities/homepage-section.entity";

export interface HomepageContentRepository {
  findActiveHomepageSections(): Promise<HomepageSectionEntity[]>;
}