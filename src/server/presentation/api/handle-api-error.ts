import { NextResponse } from "next/server";

/**
 * Prisma'nın bilinen hata kodlarını anlamlı HTTP yanıtlarına çevirir.
 * Generated client'ın hata sınıfını import etmek yerine duck-typing ile
 * `code` alanına bakar — böylece import yolu/sürüm farklarına dayanıklıdır.
 */
function getPrismaErrorCode(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }
  return null;
}

function getPrismaTarget(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "meta" in error &&
    typeof (error as { meta?: unknown }).meta === "object" &&
    (error as { meta?: { target?: unknown } }).meta?.target != null
  ) {
    const target = (error as { meta: { target: unknown } }).meta.target;
    return Array.isArray(target) ? target.join(", ") : String(target);
  }
  return null;
}

/**
 * Admin CRUD uçları için ortak hata yönetimi.
 * - P2002 (unique ihlali) → 409 + hangi alan(lar)ın çakıştığı
 * - P2003 (FK ihlali) → 400
 * - P2025 (kayıt yok) → 404
 * - diğer → 500 (loglanır)
 */
export function handleApiError(error: unknown): NextResponse {
  const code = getPrismaErrorCode(error);

  if (code === "P2002") {
    const target = getPrismaTarget(error);
    return NextResponse.json(
      {
        error: target
          ? `Bu ${target} değeri zaten kullanılıyor.`
          : "Benzersiz olması gereken bir alan zaten kullanılıyor.",
      },
      { status: 409 },
    );
  }

  if (code === "P2003") {
    return NextResponse.json(
      { error: "İlişkili bir kayıt bulunamadı (geçersiz referans)." },
      { status: 400 },
    );
  }

  if (code === "P2025") {
    return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  }

  console.error("[admin-api] beklenmeyen hata:", error);
  return NextResponse.json(
    { error: "Beklenmeyen bir hata oluştu." },
    { status: 500 },
  );
}
