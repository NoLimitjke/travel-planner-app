import { defineConfig } from "eslint/config";

export default defineConfig({
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "next"],
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: [
    ".next/",
    "out/",
    "build/",
    "next-env.d.ts"
  ],
  rules: {
    // можно добавить кастомные правила
  }
});
