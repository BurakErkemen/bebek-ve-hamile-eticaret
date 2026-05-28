import type { BannerAdminRepository } from "@/server/domain/repositories/banner-admin.repository";
import type { BannerAdminInput } from "@/server/domain/entities/banner-admin.entity";

export class ListBannersUseCase {
  constructor(private readonly repo: BannerAdminRepository) {}
  execute() { return this.repo.listBanners(); }
}

export class GetBannerAdminUseCase {
  constructor(private readonly repo: BannerAdminRepository) {}
  execute(id: string) { return this.repo.findBannerById(id); }
}

export class CreateBannerUseCase {
  constructor(private readonly repo: BannerAdminRepository) {}
  execute(input: BannerAdminInput) { return this.repo.createBanner(input); }
}

export class UpdateBannerUseCase {
  constructor(private readonly repo: BannerAdminRepository) {}
  execute(id: string, input: BannerAdminInput) { return this.repo.updateBanner(id, input); }
}

export class DeleteBannerUseCase {
  constructor(private readonly repo: BannerAdminRepository) {}
  execute(id: string) { return this.repo.deleteBanner(id); }
}
