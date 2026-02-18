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

// src/config/vitest.ts
var vitest_exports = {};
__export(vitest_exports, {
  createVitestConfig: () => createVitestConfig
});
module.exports = __toCommonJS(vitest_exports);
var import_unplugin_swc = __toESM(require("unplugin-swc"));
var import_config = require("vitest/config");
function createVitestConfig(overrides) {
  const reporter = process.env.VITEST_REPORTER ?? "default";
  return (0, import_config.defineConfig)({
    test: {
      globals: true,
      root: "./",
      reporters: process.env.GITHUB_ACTIONS ? [
        reporter,
        "github-actions"
      ] : [
        reporter
      ],
      passWithNoTests: true,
      exclude: [
        "node_modules",
        "dist"
      ],
      fileParallelism: false,
      pool: "threads",
      isolate: false,
      onConsoleLog(log) {
        if (log.includes("SERVER_ERROR") && log.includes("better-auth")) {
          return false;
        }
      },
      ...overrides?.test
    },
    plugins: [
      import_unplugin_swc.default.vite({
        module: {
          type: "es6"
        }
      }),
      ...overrides?.plugins ?? []
    ]
  });
}
__name(createVitestConfig, "createVitestConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createVitestConfig
});
