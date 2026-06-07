import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** MIME → güvenli uzantı. İstemciden gelen uzantı/MIME'e GÜVENMİYORUZ;
 *  uzantıyı buradan, gerçek içeriği magic-byte ile belirliyoruz. */
const TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export type UploadError = "INVALID_TYPE" | "TOO_LARGE" | "SAVE_FAILED";

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: UploadError };

/** Dosyanın gerçek türünü magic byte (imza) ile tespit eder.
 *  İstemcinin gönderdiği file.type'a güvenmez. */
function detectImageType(bytes: Uint8Array): string | null {
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e &&
    bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a &&
    bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  // GIF: 47 49 46 38 (GIF8)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return "image/gif";
  }
  // WEBP: RIFF....WEBP
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "TOO_LARGE" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Gerçek dosya türünü içerikten doğrula (MIME spoofing önlemi)
  const detectedType = detectImageType(buffer.subarray(0, 12));
  if (!detectedType || !(detectedType in TYPE_TO_EXT)) {
    return { success: false, error: "INVALID_TYPE" };
  }

  try {
    await mkdir(UPLOADS_DIR, { recursive: true });

    // Uzantı whitelist'ten gelir, asla istemci file.name'inden değil
    const ext = TYPE_TO_EXT[detectedType];
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    await writeFile(filepath, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch {
    return { success: false, error: "SAVE_FAILED" };
  }
}
