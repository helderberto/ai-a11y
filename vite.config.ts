import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const entries = {
  index: "src/index.ts",
  "react/index": "src/react/index.ts",
};

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  plugins: [
    dts({
      entryRoot: "src",
      include: ["src"],
      exclude: ["**/*.test.{ts,tsx}"],
    }),
  ],
  build: {
    lib: { entry: entries, formats: ["es"] },
    rolldownOptions: {
      external: ["react"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setup.tests.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
