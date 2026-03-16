import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: [
      "node_modules",
      "dist",
      "**/dist/**",
      "**/build/**",
      "**/*.scss",
      "eslint.config.js",
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "unused-imports/no-unused-imports": "error",
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        URL: "readonly",
      },
    },
  },

  {
    files: [
      "apps/frontend/src/**/*.ts",
      "apps/frontend/src/**/*.tsx",
      "apps/backend/src/**/*.ts",
      "packages/shared/src/**/*.ts",
    ],
    ignores: [],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: "module",
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        URL: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
];
