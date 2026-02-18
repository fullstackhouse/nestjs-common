"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/health/index.ts
var health_exports = {};
__export(health_exports, {
  HealthModule: () => HealthModule
});
module.exports = __toCommonJS(health_exports);
var import_common = require("@nestjs/common");
var import_swagger = require("@nestjs/swagger");
var import_terminus = require("@nestjs/terminus");
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var _a;
var HealthController = (_a = class {
  constructor(health, db) {
    __publicField(this, "health");
    __publicField(this, "db");
    this.health = health;
    this.db = db;
  }
  check() {
    return this.health.check([
      () => this.db.pingCheck("database")
    ]);
  }
}, __name(_a, "HealthController"), _a);
_ts_decorate([
  (0, import_common.Get)(),
  (0, import_terminus.HealthCheck)(),
  (0, import_swagger.ApiOperation)({
    summary: "Check API and database health"
  }),
  (0, import_swagger.ApiResponse)({
    status: 200
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", []),
  _ts_metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
HealthController = _ts_decorate([
  (0, import_common.Controller)("health"),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof import_terminus.HealthCheckService === "undefined" ? Object : import_terminus.HealthCheckService,
    typeof import_terminus.MikroOrmHealthIndicator === "undefined" ? Object : import_terminus.MikroOrmHealthIndicator
  ])
], HealthController);
var _HealthModule = class _HealthModule {
};
__name(_HealthModule, "HealthModule");
var HealthModule = _HealthModule;
HealthModule = _ts_decorate([
  (0, import_common.Module)({
    imports: [
      import_terminus.TerminusModule
    ],
    controllers: [
      HealthController
    ]
  })
], HealthModule);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HealthModule
});
