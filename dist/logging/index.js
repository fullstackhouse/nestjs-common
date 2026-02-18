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
  CommonLoggerModule: () => CommonLoggerModule
});
module.exports = __toCommonJS(logging_exports);
var import_common = require("@nestjs/common");
var import_nestjs_pino = require("nestjs-pino");

// src/env/index.ts
function getAppEnv() {
  return process.env.APP_ENV ?? "prod";
}
__name(getAppEnv, "getAppEnv");
function isLocal() {
  return getAppEnv() === "local";
}
__name(isLocal, "isLocal");

// src/logging/index.ts
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var _CommonLoggerModule = class _CommonLoggerModule {
  static forRoot(opts) {
    return {
      module: _CommonLoggerModule,
      imports: [
        import_nestjs_pino.LoggerModule.forRoot(createLoggerConfig(opts))
      ]
    };
  }
};
__name(_CommonLoggerModule, "CommonLoggerModule");
var CommonLoggerModule = _CommonLoggerModule;
CommonLoggerModule = _ts_decorate([
  (0, import_common.Module)({})
], CommonLoggerModule);
function createLoggerConfig(opts) {
  const level = opts?.level ?? process.env.LOG_LEVEL ?? "info";
  const prettyPrint = isLocal();
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
  CommonLoggerModule
});
