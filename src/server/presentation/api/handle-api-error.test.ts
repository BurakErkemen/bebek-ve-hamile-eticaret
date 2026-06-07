import { describe, it, expect, vi, afterEach } from "vitest";
import { handleApiError } from "./handle-api-error";

/**
 * handleApiError, Prisma hata kodlarını HTTP yanıtına çevirir.
 * NextResponse gerçek olarak kullanılır; .json() ile gövdeyi okuruz.
 * Bilinmeyen hatalarda console.error çağrıldığı için onu sustururuz.
 */
describe("handleApiError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Prisma bilinen hata kodları", () => {
    it("P2002 (unique ihlali) → 409 + alan adını içeren mesaj", async () => {
      const error = { code: "P2002", meta: { target: ["slug"] } };
      const res = handleApiError(error);
      expect(res.status).toBe(409);

      const body = await res.json();
      expect(body.error).toContain("slug");
    });

    it("P2002 target dizi ise alanları virgülle birleştirir", async () => {
      const error = { code: "P2002", meta: { target: ["email", "phone"] } };
      const res = handleApiError(error);
      const body = await res.json();
      expect(body.error).toContain("email, phone");
    });

    it("P2002 target yoksa genel mesaj döner", async () => {
      const res = handleApiError({ code: "P2002" });
      expect(res.status).toBe(409);
      const body = await res.json();
      expect(body.error).toContain("Benzersiz");
    });

    it("P2003 (FK ihlali) → 400", async () => {
      const res = handleApiError({ code: "P2003" });
      expect(res.status).toBe(400);
    });

    it("P2025 (kayıt yok) → 404", async () => {
      const res = handleApiError({ code: "P2025" });
      expect(res.status).toBe(404);
    });
  });

  describe("Error handling — bilinmeyen hatalar", () => {
    it("tanınmayan Prisma kodu → 500 + loglar", async () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const res = handleApiError({ code: "P9999" });

      expect(res.status).toBe(500);
      expect(spy).toHaveBeenCalled();
    });

    it("standart Error objesi → 500", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const res = handleApiError(new Error("beklenmedik"));
      expect(res.status).toBe(500);
    });

    it("string/null gibi non-error değerlerde çökmeden 500 döner", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(handleApiError("hata").status).toBe(500);
      expect(handleApiError(null).status).toBe(500);
      expect(handleApiError(undefined).status).toBe(500);
    });
  });

  describe("Edge cases", () => {
    it("code alanı string değilse (sayı) bilinmeyen kabul eder → 500", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const res = handleApiError({ code: 2002 });
      expect(res.status).toBe(500);
    });
  });
});
