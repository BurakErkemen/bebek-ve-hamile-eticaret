import type {
  ProductAdminListItem,
  ProductAdminDetail,
  ProductAdminInput,
} from "../entities/product-admin.entity";

export interface ProductAdminRepository {
  listProducts(): Promise<ProductAdminListItem[]>;
  findProductById(id: string): Promise<ProductAdminDetail | null>;
  createProduct(input: ProductAdminInput): Promise<{ id: string }>;
  updateProduct(id: string, input: ProductAdminInput): Promise<void>;
  deleteProduct(id: string): Promise<void>;
}
