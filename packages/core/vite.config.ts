import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const entries = {
  index: "src/index.ts",
};

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  plugins: [dts({ exclude: ["**/*.test.ts"] })],
  build: {
    lib: { entry: entries, formats: ["es"] },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
