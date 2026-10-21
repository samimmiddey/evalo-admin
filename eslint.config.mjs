import { defineConfig, globalIgnores } from "eslint/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/components/ui/**",
  ]),

  ...tseslint.config({
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "no-console": "error",
      "no-unused-vars": "off",
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "react/self-closing-comp": "warn",
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],
    },
  }),
]);

export default eslintConfig;
