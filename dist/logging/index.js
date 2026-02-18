"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/logging/index.ts
var logging_exports = {};
__export(logging_exports, {
  createLoggerConfig: () => createLoggerConfig
});
module.exports = __toCommonJS(logging_exports);
function createLoggerConfig(opts) {
  const level = opts?.level ?? "info";
  const prettyPrint = opts?.prettyPrint ?? false;
  const ignorePaths = opts?.ignorePaths ?? [
    "/health"
  ];
  return {
    pinoHttp: {
      level,
      transport: prettyPrint ? {
        target: "pino-pretty",
        options: {
          singleLine: true,
          ignore: "pid,hostname"
        }
      } : void 0,
      autoLogging: {
        ignore: /* @__PURE__ */ __name((req) => ignorePaths.some((p) => req.url?.startsWith(p) ?? false), "ignore")
      }
    }
  };
}
__name(createLoggerConfig, "createLoggerConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLoggerConfig
});
