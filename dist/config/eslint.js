"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/config/eslint.ts
var eslint_exports = {};
__export(eslint_exports, {
  createEslintConfig: () => createEslintConfig
});
module.exports = __toCommonJS(eslint_exports);
var import_eslintrc = require("@eslint/eslintrc");
var import_js = __toESM(require("@eslint/js"));
var import_globals = __toESM(require("globals"));
var import_typescript_eslint = __toESM(require("typescript-eslint"));
function createEslintConfig(opts) {
  const compat = new import_eslintrc.FlatCompat({
    baseDirectory: opts.rootDir,
    recommendedConfig: import_js.default.configs.recommended,
    allConfig: import_js.default.configs.all
  });
  return import_typescript_eslint.default.config({
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/metadata.d.ts"
    ]
  }, ...import_typescript_eslint.default.configs.recommended, ...import_typescript_eslint.default.configs.recommendedTypeChecked, ...import_typescript_eslint.default.configs.stylisticTypeChecked, ...compat.extends("plugin:prettier/recommended"), {
    languageOptions: {
      globals: {
        ...import_globals.default.node,
        ...import_globals.default.jest
      },
      parserOptions: {
        project: opts.tsconfigPath ?? "./tsconfig.lint.json",
        tsconfigRootDir: opts.rootDir
      }
    },
    rules: {
      curly: [
        "error",
        "all"
      ],
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array-simple"
        }
      ],
      "@typescript-eslint/return-await": [
        "error",
        "always"
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "src/**/*"
              ],
              message: 'Absolute imports from "src/" are not allowed. Use relative imports instead.'
            }
          ]
        }
      ]
    }
  }, {
    files: [
      "src/database/migrations/**/*.ts"
    ],
    rules: {
      "@typescript-eslint/require-await": "off"
    }
  }, {
    files: [
      "**/*.controller.ts",
      "**/dto/*.dto.ts"
    ],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off"
    }
  }, {
    files: [
      "**/*.test.ts",
      "**/*.spec.ts",
      "test/**/*.ts"
    ],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off"
    }
  });
}
__name(createEslintConfig, "createEslintConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createEslintConfig
});
