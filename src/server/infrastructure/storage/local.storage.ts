import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type UploadError = "INVALID_TYPE" | "TOO_LARGE" | "SAVE_FAILED";

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: UploadError };

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "INVALID_TYPE" };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "TOO_LARGE" };
  }

  try {
    await mkdir(UPLOADS_DIR, { recursive: true });

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch {
    return { success: false, error: "SAVE_FAILED" };
  }
}
