import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // The live n8n test has its own config (vitest.integration.config.mts)
    // so ordinary `npm test` and CI never call the real workflow.
    exclude: ["**/node_modules/**", "src/**/*.integration.test.ts"],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      // Measured scope: the server-side API route and the non-UI modules
      // that hold business logic. React pages and components are rendered
      // UI and are not measured here.
      include: [
        "src/app/api/**/*.ts",
        "src/lib/**/*.ts",
        "src/components/RiskBadge.tsx",
      ],
      exclude: ["**/*.test.ts"],
      reporter: ["text", "text-summary", "html", "json-summary"],
      reportsDirectory: "./coverage",
    },
  },
});
