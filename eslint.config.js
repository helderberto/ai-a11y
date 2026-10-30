import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
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
  prettier,
);
