import type {
  BannerAdminListItem,
  BannerAdminDetail,
  BannerAdminInput,
} from "../entities/banner-admin.entity";

export interface BannerAdminRepository {
  listBanners(): Promise<BannerAdminListItem[]>;
  findBannerById(id: string): Promise<BannerAdminDetail | null>;
  createBanner(input: BannerAdminInput): Promise<{ id: string }>;
  updateBanner(id: string, input: BannerAdminInput): Promise<void>;
  deleteBanner(id: string): Promise<void>;
}
