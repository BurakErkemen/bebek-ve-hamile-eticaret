import type { ProductDetailEntity } from "@/server/domain/entities/product-detail.entity";

export interface ProductDetailRepository {
  findProductDetailBySlug(slug: string): Promise<ProductDetailEntity | null>;
}