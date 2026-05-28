import type {
  HomeSectionAdminListItem,
  HomeSectionAdminDetail,
  HomeSectionAdminInput,
  HomeSectionItemAdminInput,
} from "../entities/home-section-admin.entity";

export interface HomeSectionAdminRepository {
  listHomeSections(): Promise<HomeSectionAdminListItem[]>;
  findHomeSectionById(id: string): Promise<HomeSectionAdminDetail | null>;
  createHomeSection(input: HomeSectionAdminInput): Promise<{ id: string }>;
  updateHomeSection(id: string, input: HomeSectionAdminInput): Promise<void>;
  deleteHomeSection(id: string): Promise<void>;
  createHomeSectionItem(sectionId: string, input: HomeSectionItemAdminInput): Promise<{ id: string }>;
  updateHomeSectionItem(id: string, input: HomeSectionItemAdminInput): Promise<void>;
  deleteHomeSectionItem(id: string): Promise<void>;
}
