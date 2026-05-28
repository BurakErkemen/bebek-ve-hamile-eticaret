import type { HomeSectionAdminRepository } from "@/server/domain/repositories/home-section-admin.repository";
import type { HomeSectionAdminInput, HomeSectionItemAdminInput } from "@/server/domain/entities/home-section-admin.entity";

export class ListHomeSectionsUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute() { return this.repo.listHomeSections(); }
}

export class GetHomeSectionAdminUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(id: string) { return this.repo.findHomeSectionById(id); }
}

export class CreateHomeSectionUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(input: HomeSectionAdminInput) { return this.repo.createHomeSection(input); }
}

export class UpdateHomeSectionUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(id: string, input: HomeSectionAdminInput) { return this.repo.updateHomeSection(id, input); }
}

export class DeleteHomeSectionUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(id: string) { return this.repo.deleteHomeSection(id); }
}

export class CreateHomeSectionItemUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(sectionId: string, input: HomeSectionItemAdminInput) { return this.repo.createHomeSectionItem(sectionId, input); }
}

export class UpdateHomeSectionItemUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(id: string, input: HomeSectionItemAdminInput) { return this.repo.updateHomeSectionItem(id, input); }
}

export class DeleteHomeSectionItemUseCase {
  constructor(private readonly repo: HomeSectionAdminRepository) {}
  execute(id: string) { return this.repo.deleteHomeSectionItem(id); }
}
