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

// src/database/migrate.ts
var migrate_exports = {};
__export(migrate_exports, {
  parseMigrateArgs: () => parseMigrateArgs,
  runMigrations: () => runMigrations
});
module.exports = __toCommonJS(migrate_exports);
function buildMigratorOptions(options) {
  const { to, from, only } = options;
  const migrateOpts = {};
  if (to !== void 0) {
    migrateOpts.to = to === "0" ? 0 : to;
  }
  if (from !== void 0) {
    migrateOpts.from = from === "0" ? 0 : from;
  }
  if (only && only.length > 0) {
    migrateOpts.migrations = only;
  }
  return migrateOpts;
}
__name(buildMigratorOptions, "buildMigratorOptions");
function parseMigrateArgs(argv = process.argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    console.log("Usage: migrate <up|down> [options]");
    console.log("  --disable-custom-schema  Use default public schema");
    console.log("  -t, --to <version>       Migrate to specific version");
    console.log("  -f, --from <version>     Migrate from specific version");
    console.log("  -o, --only <versions>    Only specified versions (comma separated)");
    process.exit(args.length === 0 ? 1 : 0);
  }
  const direction = args[0];
  if (direction !== "up" && direction !== "down") {
    console.error(`Invalid direction "${String(direction)}". Must be "up" or "down"`);
    process.exit(1);
  }
  const parsed = {
    direction,
    disableCustomSchema: false
  };
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--disable-custom-schema") {
      parsed.disableCustomSchema = true;
    } else if (arg === "-t" || arg === "--to") {
      parsed.to = args[++i];
    } else if (arg.startsWith("--to=")) {
      parsed.to = arg.split("=")[1];
    } else if (arg === "-f" || arg === "--from") {
      parsed.from = args[++i];
    } else if (arg.startsWith("--from=")) {
      parsed.from = arg.split("=")[1];
    } else if (arg === "-o" || arg === "--only") {
      parsed.only = args[++i].split(/[, ]+/);
    } else if (arg.startsWith("--only=")) {
      parsed.only = arg.split("=")[1].split(/[, ]+/);
    }
  }
  return parsed;
}
__name(parseMigrateArgs, "parseMigrateArgs");
async function runMigrations(config, options) {
  const { disableCustomSchema = false, direction = "up" } = options;
  const schema = config.schema ?? "public";
  const targetSchema = disableCustomSchema ? "public" : schema;
  const useCustomSchema = targetSchema !== "public" && !disableCustomSchema;
  console.log("==================");
  console.log("Database Migration");
  console.log("==================");
  console.log(`Direction: ${direction}`);
  console.log(`Target schema: ${targetSchema}`);
  console.log("");
  const { MikroORM } = await import("@mikro-orm/postgresql");
  let orm;
  try {
    orm = await MikroORM.init({
      ...config,
      schema,
      pool: {
        min: 1,
        max: 2
      }
    });
    const migrateOpts = buildMigratorOptions(options);
    const connection = orm.em.getConnection();
    await connection.transactional(async (trx) => {
      if (useCustomSchema) {
        console.log(`Setting search_path to '${targetSchema}'...`);
        await connection.execute(`SET search_path TO ??`, [
          targetSchema
        ], void 0, trx);
        migrateOpts.transaction = trx;
      }
      if (direction === "up") {
        const pending = await orm.migrator.getPendingMigrations();
        if (pending.length === 0) {
          console.log("No pending migrations to execute");
          return;
        }
        console.log(`Found ${pending.length} pending migration(s)`);
        const result = await orm.migrator.up(migrateOpts);
        if (result.length > 0) {
          console.log(`Successfully executed ${result.length} migration(s)`);
        }
      } else {
        const result = await orm.migrator.down(migrateOpts);
        if (result.length > 0) {
          console.log(`Successfully rolled back ${result.length} migration(s)`);
        }
      }
    });
    console.log("");
    console.log("Migration completed successfully!");
    await orm.close(true);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed");
    console.error(error);
    if (orm) {
      await orm.close(true);
    }
    process.exit(1);
  }
}
__name(runMigrations, "runMigrations");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseMigrateArgs,
  runMigrations
});
