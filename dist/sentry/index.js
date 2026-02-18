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

// src/sentry/index.ts
var sentry_exports = {};
__export(sentry_exports, {
  CommonSentryModule: () => CommonSentryModule,
  SentryExceptionFilter: () => SentryExceptionFilter,
  SentryModule: () => import_setup.SentryModule,
  initSentry: () => initSentry
});
module.exports = __toCommonJS(sentry_exports);
var import_common = require("@nestjs/common");
var import_core = require("@nestjs/core");
var Sentry = __toESM(require("@sentry/nestjs"));
var import_profiling_node = require("@sentry/profiling-node");
var import_setup = require("@sentry/nestjs/setup");
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function initSentry(opts) {
  const { filter4xx = true, ...sentryOpts } = opts;
  Sentry.init({
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
    integrations: [
      (0, import_profiling_node.nodeProfilingIntegration)()
    ],
    ...sentryOpts,
    beforeSend(event, hint) {
      if (filter4xx) {
        const error = hint.originalException;
        if (error instanceof import_common.HttpException && error.getStatus() < 500) {
          return null;
        }
      }
      return sentryOpts.beforeSend?.(event, hint) ?? event;
    }
  });
}
__name(initSentry, "initSentry");
var _SentryExceptionFilter = class _SentryExceptionFilter extends import_core.BaseExceptionFilter {
  catch(exception, host) {
    Sentry.captureException(exception);
    return super.catch(exception, host);
  }
};
__name(_SentryExceptionFilter, "SentryExceptionFilter");
var SentryExceptionFilter = _SentryExceptionFilter;
var _CommonSentryModule = class _CommonSentryModule {
  static forRoot() {
    return {
      module: _CommonSentryModule,
      imports: [
        import_setup.SentryModule.forRoot()
      ],
      providers: [
        {
          provide: import_core.APP_FILTER,
          useClass: SentryExceptionFilter
        }
      ]
    };
  }
};
__name(_CommonSentryModule, "CommonSentryModule");
var CommonSentryModule = _CommonSentryModule;
CommonSentryModule = _ts_decorate([
  (0, import_common.Module)({})
], CommonSentryModule);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CommonSentryModule,
  SentryExceptionFilter,
  SentryModule,
  initSentry
});
