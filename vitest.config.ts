import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// @/* path alias'ları için vite-tsconfig-paths kullanılıyor.
// (Vitest'in native test.tsconfigPaths opsiyonu bu sürümde alias'ları
//  güvenilir çözmediği için plugin tercih edildi.)
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    env: {
      ADMIN_SESSION_SECRET: "test-secret-en-az-32-karakter-uzunlugunda-olmali",
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/generated/**", "src/**/*.d.ts"],
    },
  },
});
