import type { ProductAdminRepository } from "@/server/domain/repositories/product-admin.repository";
import type { ProductAdminInput } from "@/server/domain/entities/product-admin.entity";

export class UpdateProductUseCase {
  constructor(private readonly repo: ProductAdminRepository) {}

  async execute(id: string, input: ProductAdminInput) {
    return this.repo.updateProduct(id, input);
  }
}
