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

// src/http/index.ts
var http_exports = {};
__export(http_exports, {
  createCorsConfig: () => createCorsConfig,
  getRequestClientIp: () => getRequestClientIp
});
module.exports = __toCommonJS(http_exports);
function getRequestClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim();
  }
  return req.socket.remoteAddress;
}
__name(getRequestClientIp, "getRequestClientIp");
function createCorsConfig(opts) {
  return {
    origin: opts.appEnv === "local" ? true : opts.allowedOrigins,
    credentials: true
  };
}
__name(createCorsConfig, "createCorsConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCorsConfig,
  getRequestClientIp
});
