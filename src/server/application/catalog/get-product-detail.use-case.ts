import type { ProductDetailEntity } from "@/server/domain/entities/product-detail.entity";
import type { ProductDetailRepository } from "@/server/domain/repositories/product-detail.repository";

export class GetProductDetailUseCase {
  constructor(
    private readonly productDetailRepository: ProductDetailRepository,
  ) {}

  async execute(slug: string): Promise<ProductDetailEntity | null> {
    return this.productDetailRepository.findProductDetailBySlug(slug);
  }
}