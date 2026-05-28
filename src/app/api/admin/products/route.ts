import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaProductAdminRepository } from "@/server/infrastructure/database/repositories/prisma-product-admin.repository";
import { ListProductsUseCase } from "@/server/application/admin/products/list-products.use-case";
import { CreateProductUseCase } from "@/server/application/admin/products/create-product.use-case";

const variantSchema = z.object({
  sku: z.string().min(1),
  size: z.string().optional(),
  colorName: z.string().optional(),
  colorHex: z.string().optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
  isPrimary: z.boolean(),
  sortOrder: z.number().int(),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  categoryId: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().int(),
  images: z.array(imageSchema),
  variants: z.array(variantSchema).min(1, "En az bir varyant gereklidir"),
});

export async function GET() {
  const repo = new PrismaProductAdminRepository();
  const products = await new ListProductsUseCase(repo).execute();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const repo = new PrismaProductAdminRepository();
  const result = await new CreateProductUseCase(repo).execute(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
