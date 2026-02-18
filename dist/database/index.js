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

// src/database/index.ts
var database_exports = {};
__export(database_exports, {
  createDatabaseConfig: () => createDatabaseConfig,
  createDatabaseConnectionConfig: () => createDatabaseConnectionConfig
});
module.exports = __toCommonJS(database_exports);
var import_core = require("@mikro-orm/core");
var import_migrations = require("@mikro-orm/migrations");
var import_debug = __toESM(require("debug"));

// src/env/index.ts
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

// src/database/index.ts
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
function createDatabaseConfig(opts) {
  const cli = parseBoolean(process.env.CLI) ?? false;
  const entitiesPath = opts.entitiesPath ?? "./dist/database/entities";
  const entitiesTsPath = opts.entitiesTsPath ?? "./src/database/entities";
  return {
    ...createDatabaseConnectionConfig(opts),
    entities: [
      `${entitiesPath}/**/*.js`
    ],
    entitiesTs: [
      `${entitiesTsPath}/**/*.ts`
    ],
    discovery: {
      warnWhenNoEntities: false
    },
    debug: import_debug.default.enabled("mikro-orm"),
    namingStrategy: import_core.UnderscoreNamingStrategy,
    extensions: [
      import_migrations.Migrator
    ],
    migrations: {
      path: opts.migrationsPath ?? "./dist/database/migrations",
      pathTs: opts.migrationsTsPath ?? "./src/database/migrations"
    },
    allowGlobalContext: cli
  };
}
__name(createDatabaseConfig, "createDatabaseConfig");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createDatabaseConfig,
  createDatabaseConnectionConfig
});
