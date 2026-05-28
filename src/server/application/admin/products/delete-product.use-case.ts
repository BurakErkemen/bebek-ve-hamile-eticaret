import type { ProductAdminRepository } from "@/server/domain/repositories/product-admin.repository";

export class DeleteProductUseCase {
  constructor(private readonly repo: ProductAdminRepository) {}

  async execute(id: string) {
    return this.repo.deleteProduct(id);
  }
}
