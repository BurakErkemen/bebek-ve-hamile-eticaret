import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { PrismaProductAdminRepository } from "@/server/infrastructure/database/repositories/prisma-product-admin.repository";
import { GetProductAdminUseCase } from "@/server/application/admin/products/get-product-admin.use-case";
import { UpdateProductUseCase } from "@/server/application/admin/products/update-product.use-case";
import { DeleteProductUseCase } from "@/server/application/admin/products/delete-product.use-case";
import { handleApiError } from "@/server/presentation/api/handle-api-error";

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
  variants: z.array(variantSchema).min(1),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const repo = new PrismaProductAdminRepository();
    const product = await new GetProductAdminUseCase(repo).execute(id);
    if (!product)
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const repo = new PrismaProductAdminRepository();
    await new UpdateProductUseCase(repo).execute(id, parsed.data);

    revalidateTag("products", "client");

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const repo = new PrismaProductAdminRepository();
    await new DeleteProductUseCase(repo).execute(id);

    revalidateTag("products", "client");

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
