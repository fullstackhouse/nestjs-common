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

// src/swagger/index.ts
var swagger_exports = {};
__export(swagger_exports, {
  generateMetadata: () => generateMetadata
});
module.exports = __toCommonJS(swagger_exports);
var import_plugin_metadata_generator = require("@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator");
var import_plugin = require("@nestjs/swagger/dist/plugin");
var import_path = require("path");
function generateMetadata(opts) {
  const generator = new import_plugin_metadata_generator.PluginMetadataGenerator();
  generator.generate({
    visitors: [
      new import_plugin.ReadonlyVisitor({
        introspectComments: true,
        pathToSource: (0, import_path.join)(opts.rootDir, "src"),
        classValidatorShim: false
      })
    ],
    outputDir: (0, import_path.join)(opts.rootDir, "src"),
    watch: false,
    tsconfigPath: "tsconfig.json"
  });
}
__name(generateMetadata, "generateMetadata");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateMetadata
});
