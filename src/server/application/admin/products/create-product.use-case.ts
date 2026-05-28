import type { ProductAdminRepository } from "@/server/domain/repositories/product-admin.repository";
import type { ProductAdminInput } from "@/server/domain/entities/product-admin.entity";

export class CreateProductUseCase {
  constructor(private readonly repo: ProductAdminRepository) {}

  async execute(input: ProductAdminInput) {
    return this.repo.createProduct(input);
  }
}
