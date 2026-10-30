import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

import { defineConfig } from "vitest/config";

// Only the N8N_* variables are read from .env.local; values already set in
// the shell take precedence.
function loadN8nEnv() {
  const file = fileURLToPath(new URL("./.env.local", import.meta.url));
  const fromFile = existsSync(file) ? parseEnv(readFileSync(file, "utf8")) : {};
  const env: Record<string, string> = {};

  for (const name of ["N8N_WEBHOOK_URL", "N8N_WEBHOOK_SECRET"]) {
    const value = process.env[name] ?? fromFile[name];
    if (value) env[name] = value;
  }

  return env;
}

// Live integration tests: real n8n workflow, real Google Sheets, real Gemini.
// Run explicitly with `npm run test:integration`; never part of CI.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.integration.test.ts"],
    env: loadN8nEnv(),
    // The multi-agent Gemini workflow can take well over a minute.
    testTimeout: 180_000,
  },
});
