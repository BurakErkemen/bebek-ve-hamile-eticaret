import type { CategoryAdminRepository } from "@/server/domain/repositories/category-admin.repository";
import type { CategoryAdminInput } from "@/server/domain/entities/category-admin.entity";

export class ListCategoriesUseCase {
  constructor(private readonly repo: CategoryAdminRepository) {}
  execute() { return this.repo.listCategories(); }
}

export class GetCategoryAdminUseCase {
  constructor(private readonly repo: CategoryAdminRepository) {}
  execute(id: string) { return this.repo.findCategoryById(id); }
}

export class CreateCategoryUseCase {
  constructor(private readonly repo: CategoryAdminRepository) {}
  execute(input: CategoryAdminInput) { return this.repo.createCategory(input); }
}

export class UpdateCategoryUseCase {
  constructor(private readonly repo: CategoryAdminRepository) {}
  execute(id: string, input: CategoryAdminInput) { return this.repo.updateCategory(id, input); }
}

export class DeleteCategoryUseCase {
  constructor(private readonly repo: CategoryAdminRepository) {}
  execute(id: string) { return this.repo.deleteCategory(id); }
}
