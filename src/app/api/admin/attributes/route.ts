import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaAttributeAdminRepository } from "@/server/infrastructure/database/repositories/prisma-attribute-admin.repository";
import {
  ListAttributesUseCase,
  CreateAttributeUseCase,
} from "@/server/application/admin/attributes/attribute-admin.use-cases";

const attributeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  displayType: z.enum(["CHECKBOX", "RADIO", "COLOR_SWATCH", "BADGE"]),
  isFilterable: z.boolean(),
  isVisibleOnProductDetail: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
});

export async function GET() {
  const repo = new PrismaAttributeAdminRepository();
  const attributes = await new ListAttributesUseCase(repo).execute();
  return NextResponse.json(attributes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = attributeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const repo = new PrismaAttributeAdminRepository();
  const result = await new CreateAttributeUseCase(repo).execute(parsed.data);
  return NextResponse.json(result, { status: 201 });
}
