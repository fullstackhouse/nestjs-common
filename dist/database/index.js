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

// src/database/index.ts
var database_exports = {};
__export(database_exports, {
  createDatabaseConnectionConfig: () => createDatabaseConnectionConfig
});
module.exports = __toCommonJS(database_exports);
function createDatabaseConnectionConfig(opts) {
  if (process.env.SKIP_DB_CONNECTION === "true") {
    return {
      host: "localhost",
      port: 5432,
      user: "user",
      password: "password",
      dbName: "db",
      schema: "public",
      connect: false
    };
  }
  if (opts.databaseUrl) {
    const url = new URL(opts.databaseUrl);
    const socketPath = url.searchParams.get("host");
    if (socketPath) {
      return {
        host: socketPath,
        port: 5432,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        dbName: url.pathname.slice(1),
        schema: opts.schema ?? "public"
      };
    }
    return {
      clientUrl: opts.databaseUrl,
      schema: opts.schema ?? "public"
    };
  }
  return {
    host: opts.host ?? "localhost",
    port: opts.port ?? 5432,
    user: opts.user ?? "postgres",
    password: opts.password ?? "postgres",
    dbName: opts.dbName ?? "app",
    schema: opts.schema ?? "public"
  };
}
__name(createDatabaseConnectionConfig, "createDatabaseConnectionConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDatabaseConnectionConfig
});
