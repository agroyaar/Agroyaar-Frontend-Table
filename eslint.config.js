import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const compat = new FlatCompat({
  recommendedConfig: {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  },
});

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },

  ...compat.extends(),

  {
    files: ["*.ts", "*.tsx", "src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "warn",
      "brace-style": ["error", "1tbs"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-extra-semi": "error",
      "space-before-blocks": "error",
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "object-curly-spacing": ["error", "always"],
      eqeqeq: "error",
      semi: ["error", "always"],
      curly: "error",
    },
  },
];
