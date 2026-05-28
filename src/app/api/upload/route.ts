import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile } from "@/server/infrastructure/storage/local.storage";


const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TYPE: "Sadece JPEG, PNG, WebP ve GIF yüklenebilir.",
  TOO_LARGE: "Dosya boyutu 5 MB'dan küçük olmalıdır.",
  SAVE_FAILED: "Dosya kaydedilemedi.",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const result = await saveUploadedFile(file);

  if (!result.success) {
    return NextResponse.json(
      { error: ERROR_MESSAGES[result.error] },
      { status: 400 },
    );
  }

  return NextResponse.json({ url: result.url }, { status: 201 });
}
