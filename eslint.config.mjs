import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "components/**/*.{ts,tsx}",
      "features/**/*.{ts,tsx}",
      "lib/http/**/*.{ts,tsx}",
      "lib/query/**/*.{ts,tsx}",
      "app/providers.tsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/server/*", "**/lib/server/*", "@prisma/client", "bcrypt", "jsonwebtoken"],
              message:
                "Server-only modules (DB, secrets, auth session, Paymob, AI backend) must not be imported into client or feature UI code.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
