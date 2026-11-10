module.exports = {
  root: true,
  env: { browser: true, node: true, es2020: true, jest: true },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist/", "node_modules/"],
  rules: { "no-var": "error", "prefer-const": "error", "no-console": "error" },
};
