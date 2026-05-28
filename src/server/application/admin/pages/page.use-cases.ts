import type { PageRepository } from "@/server/domain/repositories/page.repository";
import type { PageInput } from "@/server/domain/entities/page.entity";

export class GetPageBySlugUseCase {
  constructor(private readonly repo: PageRepository) {}
  execute(slug: string) { return this.repo.findPageBySlug(slug); }
}

export class GetPageBySlugAdminUseCase {
  constructor(private readonly repo: PageRepository) {}
  execute(slug: string) { return this.repo.findPageBySlugAdmin(slug); }
}

export class UpsertPageBySlugUseCase {
  constructor(private readonly repo: PageRepository) {}
  execute(slug: string, input: PageInput) { return this.repo.upsertPageBySlug(slug, input); }
}

export class GetCorporatePageStatusesUseCase {
  constructor(private readonly repo: PageRepository) {}
  execute(slugs: string[]) { return this.repo.getCorporatePageStatuses(slugs); }
}
