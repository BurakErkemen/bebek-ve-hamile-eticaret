import { describe, it, expect } from "vitest";
import { formatTRY } from "./format-currency";

/**
 * formatTRY — Türk Lirası para birimi biçimlendirme.
 * Intl çıktısındaki boşluk karakteri tarayıcı/Node sürümüne göre normal
 * boşluk yerine NBSP ( ) olabilir; bu yüzden tam string yerine
 * "içerir" tabanlı doğrulamalar kullanıyoruz.
 */
describe("formatTRY", () => {
  describe("Happy path", () => {
    it("varsayılan olarak kuruş (2 ondalık) ile biçimlendirir", () => {
      const result = formatTRY(1234.5);
      expect(result).toContain("1.234,50");
      expect(result).toContain("₺");
    });

    it("decimals:false ile kuruşları gizler", () => {
      const result = formatTRY(1234.5, { decimals: false });
      expect(result).toContain("1.235"); // yuvarlanır
      expect(result).not.toContain(",50");
    });

    it("binlik ayıracı olarak nokta kullanır (tr-TR)", () => {
      expect(formatTRY(1000000, { decimals: false })).toContain("1.000.000");
    });
  });

  describe("Edge cases", () => {
    it("sıfırı doğru biçimlendirir", () => {
      expect(formatTRY(0)).toContain("0,00");
    });

    it("negatif değerleri biçimlendirir", () => {
      expect(formatTRY(-50)).toContain("50");
      expect(formatTRY(-50)).toMatch(/-|−/); // eksi işareti
    });

    it("çok büyük sayıları taşmadan biçimlendirir", () => {
      const result = formatTRY(9_999_999_999.99);
      expect(result).toContain("9.999.999.999,99");
    });

    it("ondalık yuvarlamayı doğru yapar (0.005 → 0,01 değil banker's)", () => {
      // Intl yarıdan yukarı yuvarlar
      expect(formatTRY(2.555)).toContain("2,56");
    });

    it("çok küçük ondalıkları sıfıra yuvarlar", () => {
      expect(formatTRY(0.001)).toContain("0,00");
    });
  });

  describe("decimals seçeneği davranışı", () => {
    it("decimals:true açıkça verildiğinde ondalık gösterir", () => {
      expect(formatTRY(10, { decimals: true })).toContain("10,00");
    });

    it("boş options objesi varsayılana (ondalıklı) düşer", () => {
      expect(formatTRY(10, {})).toContain("10,00");
    });
  });
});
