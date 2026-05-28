import type { PageDetail, PageInput, CorporatePageStatus } from "@/server/domain/entities/page.entity";

export interface PageRepository {
  findPageBySlug(slug: string): Promise<PageDetail | null>;
  findPageBySlugAdmin(slug: string): Promise<PageDetail | null>;
  upsertPageBySlug(slug: string, input: PageInput): Promise<void>;
  getCorporatePageStatuses(slugs: string[]): Promise<CorporatePageStatus[]>;
}
