import type { ProductAdminRepository } from "@/server/domain/repositories/product-admin.repository";

export class ListProductsUseCase {
  constructor(private readonly repo: ProductAdminRepository) {}

  async execute() {
    return this.repo.listProducts();
  }
}
