import type {
  CategoryAdminListItem,
  CategoryAdminDetail,
  CategoryAdminInput,
} from "../entities/category-admin.entity";

export interface CategoryAdminRepository {
  listCategories(): Promise<CategoryAdminListItem[]>;
  findCategoryById(id: string): Promise<CategoryAdminDetail | null>;
  createCategory(input: CategoryAdminInput): Promise<{ id: string }>;
  updateCategory(id: string, input: CategoryAdminInput): Promise<void>;
  deleteCategory(id: string): Promise<void>;
}
