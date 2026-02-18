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

// src/env/index.ts
var env_exports = {};
__export(env_exports, {
  getAppEnv: () => getAppEnv,
  isLocal: () => isLocal,
  parseBoolean: () => parseBoolean
});
module.exports = __toCommonJS(env_exports);
function parseBoolean(value) {
  if (value === "1" || value === "true") {
    return true;
  }
  if (value === "0" || value === "false") {
    return false;
  }
  return void 0;
}
__name(parseBoolean, "parseBoolean");
function getAppEnv() {
  return process.env.APP_ENV || "prod";
}
__name(getAppEnv, "getAppEnv");
function isLocal() {
  return getAppEnv() === "local";
}
__name(isLocal, "isLocal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAppEnv,
  isLocal,
  parseBoolean
});
