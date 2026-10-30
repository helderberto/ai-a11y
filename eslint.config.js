import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

const barrelOnly = [
  {
    group: ["@/*/*"],
    message: "Import other modules through their barrel: @/<module>.",
  },
  {
    group: ["../*"],
    message: "Use @/<module> to import another module.",
  },
];

export default tseslint.config(
  { ignores: ["**/dist", "**/node_modules", "coverage"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      curly: ["error", "all"],
      "max-params": ["error", 2],
      "max-lines": [
        "error",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.{ts,tsx}"],
  })),
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { projectService: true },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: ["src/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message: "Use named exports.",
        },
      ],
    },
  },
  {
    files: ["src/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: barrelOnly }],
    },
  },
  {
    files: ["src/core/**", "src/index.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...barrelOnly,
            {
              group: [
                "react",
                "react-dom",
                "svelte",
                "vue",
                "@/react",
                "@/react/*",
              ],
              message: "Core must stay framework-free.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "setup.tests.ts"],
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
    languageOptions: vitest.configs.env.languageOptions,
  },
  prettier,
);
