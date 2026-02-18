# @fullstackhouse/nestjs-common

Common utilities for building NestJS backends. Provides reusable modules, configuration presets, and helpers extracted from production projects.

## Installation

```bash
pnpm add @fullstackhouse/nestjs-common
```

All dependencies are optional peers — install only what you use.

---

## Modules

### Environment — [`/env`](src/env/index.ts)

Helpers for reading environment variables with type safety.

#### `parseBoolean(value: string | undefined): boolean | undefined`

Parses string env vars into booleans. Returns `true` for `'1'`/`'true'`, `false` for `'0'`/`'false'`, and `undefined` for anything else.

```ts
import { parseBoolean } from '@fullstackhouse/nestjs-common/env';

export const sentryEnabled = parseBoolean(process.env.SENTRY_ENABLED) ?? true;
export const cli = parseBoolean(process.env.CLI) ?? false;
```

#### `getAppEnv(): string`

Returns `process.env.APP_ENV`, defaulting to `'prod'`. Used internally by other modules (e.g. logging) to toggle behavior.

#### `isLocal(): boolean`

Returns `true` when `APP_ENV === 'local'`.

---

### HTTP — [`/http`](src/http/index.ts)

HTTP request helpers.

#### `getRequestClientIp(req: Request): string | undefined`

Extracts the client IP address from an Express request. Reads the first IP from the `x-forwarded-for` header (for reverse proxies / load balancers), falling back to `req.socket.remoteAddress`.

```ts
import { getRequestClientIp } from '@fullstackhouse/nestjs-common/http';

const ip = getRequestClientIp(req);
```

---

### Sentry — [`/sentry`](src/sentry/index.ts)

Sentry error tracking integration for NestJS. Requires `@sentry/nestjs` and `@sentry/profiling-node` as peer deps.

#### `initSentry(opts: InitSentryOptions): void`

Wraps `Sentry.init()` with production-friendly defaults:

- `tracesSampleRate: 0.1`, `profilesSampleRate: 0.1`
- Node.js profiling integration
- **4xx filter** (enabled by default): prevents `HttpException` with 4xx status codes from being reported to Sentry. Disable with `filter4xx: false`.

Any standard `Sentry.init()` options can be passed through. If you provide a custom `beforeSend`, it runs after the 4xx filter.

```ts
// sentry.ts — import at the top of main.ts
import { initSentry } from '@fullstackhouse/nestjs-common/sentry';

initSentry({
  enabled: sentryEnabled,
  dsn: sentryDsn,
  environment: appEnv,
});
```

#### `CommonSentryModule.forRoot(): DynamicModule`

All-in-one module that registers both `SentryModule` (instrumentation) and `SentryExceptionFilter` (global exception capture). This is the recommended way to set up Sentry:

```ts
import { CommonSentryModule } from '@fullstackhouse/nestjs-common/sentry';

@Module({
  imports: [CommonSentryModule.forRoot()],
})
export class AppModule {}
```

#### `SentryExceptionFilter`

Global exception filter that captures all exceptions to Sentry, then delegates to NestJS's default error handling. Included automatically by `CommonSentryModule` — only use directly if you need custom provider registration.

#### `SentryModule`

Re-exported from `@sentry/nestjs/setup`. Registers Sentry instrumentation in the NestJS dependency injection system. Included automatically by `CommonSentryModule`.

---

### Logging — [`/logging`](src/logging/index.ts)

Pino-based structured logging for NestJS. Requires `nestjs-pino` and `pino-http` as peer deps.

#### `CommonLoggerModule.forRoot(opts?): DynamicModule`

NestJS dynamic module that configures `nestjs-pino` with sensible defaults:

- **Log level**: reads `process.env.LOG_LEVEL`, defaults to `'info'`
- **Pretty printing**: enabled automatically when `APP_ENV === 'local'` (uses `pino-pretty` with single-line output and hidden `pid`/`hostname`)
- **Ignored paths**: suppresses access logs for `/health` by default (configurable via `ignorePaths`)

Options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | `string` | `process.env.LOG_LEVEL ?? 'info'` | Pino log level |
| `ignorePaths` | `string[]` | `['/health']` | URL paths to exclude from access logs |

```ts
import { CommonLoggerModule } from '@fullstackhouse/nestjs-common/logging';

@Module({
  imports: [CommonLoggerModule.forRoot()],
})
export class AppModule {}
```

---

### CLS — [`/cls`](src/cls/index.ts)

Continuation Local Storage configuration. Requires `nestjs-cls` as peer dep.

#### `createClsConfig(): ClsModuleOptions`

Returns a base configuration object for `ClsModule`. Currently returns an empty config — extend it in your app as needed.

---

### Validation — [`/validation`](src/validation/index.ts)

Global Zod-based validation. Requires `nestjs-zod` and `@nestjs/common` as peer deps.

#### `setupValidation(app: INestApplication): void`

Registers `ZodValidationPipe` from `nestjs-zod` as a global pipe. Call in `main.ts` before `app.listen()`.

```ts
import { setupValidation } from '@fullstackhouse/nestjs-common/validation';

const app = await NestFactory.create(AppModule);
setupValidation(app);
await app.listen(3000);
```

---

### Database — [`/database`](src/database/index.ts)

MikroORM + PostgreSQL configuration helpers. Requires `@mikro-orm/core`, `@mikro-orm/postgresql`, `@mikro-orm/migrations`, and `debug` as peer deps.

#### `createDatabaseConnectionConfig(opts: DatabaseConnectionOptions)`

Builds the connection portion of a MikroORM config. Supports multiple connection strategies:

| Strategy | When | Behavior |
|----------|------|----------|
| `SKIP_DB_CONNECTION=true` env var | CI/build without a DB | Returns `{ connect: false }` |
| `databaseUrl` with `?host=` query param | GCP Cloud SQL Unix sockets | Extracts socket path, user, password, dbName from URL |
| `databaseUrl` (standard) | Standard connection strings | Returns `{ clientUrl, schema }` |
| Individual fields | Local development | Uses `host`/`port`/`user`/`password`/`dbName` with defaults (`localhost:5432`, user `postgres`, db `app`) |

```ts
interface DatabaseConnectionOptions {
  databaseUrl?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  dbName?: string;
  schema?: string;
}
```

#### `createDatabaseConfig(opts: DatabaseConfigOptions)`

Builds a complete MikroORM config on top of `createDatabaseConnectionConfig`. Adds:

- **Entity discovery**: globs for `./dist/database/entities/**/*.js` and `./src/database/entities/**/*.ts` (overridable)
- **`UnderscoreNamingStrategy`**: automatic camelCase to snake_case column mapping
- **Migrator extension** with configurable paths (defaults: `./dist/database/migrations`, `./src/database/migrations`)
- **Debug logging**: enabled when the `mikro-orm` debug namespace is active (`DEBUG=mikro-orm`)
- **`allowGlobalContext`**: enabled when `CLI=true` env var is set (for migration scripts)

```ts
interface DatabaseConfigOptions extends DatabaseConnectionOptions {
  entitiesPath?: string;      // default: './dist/database/entities'
  entitiesTsPath?: string;    // default: './src/database/entities'
  migrationsPath?: string;    // default: './dist/database/migrations'
  migrationsTsPath?: string;  // default: './src/database/migrations'
}
```

```ts
// mikro-orm.config.ts
import { createDatabaseConfig } from '@fullstackhouse/nestjs-common/database';
import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig(
  createDatabaseConfig({
    databaseUrl,
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    dbName,
    schema: dbSchema,
  }),
);
```

---

### Migrations — [`/database/migrate`](src/database/migrate.ts)

CLI migration runner for MikroORM. Requires `@mikro-orm/core` and `@mikro-orm/postgresql` as peer deps.

#### `parseMigrateArgs(argv?: string[]): MigrateOptions`

Parses CLI arguments for migration scripts. Defaults to `process.argv`.

Supported flags:

| Flag | Description |
|------|-------------|
| `up` / `down` | Migration direction (positional, required) |
| `--disable-custom-schema` | Don't set `search_path` before migrating |
| `-t` / `--to <version>` | Migrate to a specific version |
| `-f` / `--from <version>` | Migrate from a specific version |
| `-o` / `--only <versions>` | Run only specific migrations (comma or space separated) |
| `-h` / `--help` | Print usage and exit |

#### `runMigrations(config: Options, options: MigrateOptions): Promise<void>`

Initializes MikroORM, then runs `migrator.up()` or `migrator.down()` inside a transaction. If the config uses a custom schema (not `public`), it sets `search_path` on the connection before migrating (disable with `--disable-custom-schema`). Exits the process with code `0` on success, `1` on failure.

```ts
// migrate.ts
import { parseMigrateArgs, runMigrations } from '@fullstackhouse/nestjs-common/database/migrate';
import config from './mikro-orm.config';

void runMigrations(config, parseMigrateArgs());
```

Usage: `ts-node src/database/migrate.ts up` / `ts-node src/database/migrate.ts down --to 20240101`

---

### Testing Setup — [`/testing/setup`](src/testing/setup.ts)

Side-effect import that loads `dotenv` and `reflect-metadata`. Use as a Vitest `setupFiles` entry to ensure env vars and decorator metadata are available before tests.

```ts
// test/setup.ts
import '@fullstackhouse/nestjs-common/testing/setup';
```

---

## Configuration Presets

### Vitest — [`/config/vitest`](src/config/vitest.ts)

#### `createVitestConfig(overrides?): UserConfig`

Creates a Vitest config with production-tested defaults:

- **SWC plugin** for fast TypeScript compilation (ES6 module output)
- **Globals enabled** (`describe`, `it`, `expect` without imports)
- **GitHub Actions reporter** added automatically in CI
- **better-auth noise filter**: suppresses `SERVER_ERROR` console logs from better-auth during tests
- **Thread pool** with `fileParallelism: false` and `isolate: false` for speed
- **Excludes** `node_modules` and `dist`

Override any `test` options or add Vite `plugins`:

```ts
// vitest.config.ts
import { createVitestConfig } from '@fullstackhouse/nestjs-common/config/vitest';

export default createVitestConfig({
  test: { setupFiles: ['./test/setup.ts'] },
});
```

---

### ESLint — [`/config/eslint`](src/config/eslint.ts)

#### `createEslintConfig(opts: CreateEslintConfigOptions): ConfigArray`

Creates an ESLint flat config with:

- `typescript-eslint` recommended + type-checked + stylistic rules
- `prettier` integration via `eslint-plugin-prettier`
- **Custom rules**: `curly: 'all'`, `array-type: 'array-simple'`, `return-await: 'always'`, no absolute `src/` imports
- **Relaxed rules** for migrations (`require-await: off`), controllers/DTOs (`no-unsafe-call: off`), and test files (multiple `no-unsafe-*: off`)

Options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rootDir` | `string` | (required) | Absolute path to the project root |
| `tsconfigPath` | `string` | `'./tsconfig.lint.json'` | Path to the tsconfig for type-checked linting |

```js
// eslint.config.mjs
import { createEslintConfig } from '@fullstackhouse/nestjs-common/config/eslint';

export default createEslintConfig({
  rootDir: import.meta.dirname,
});
```

Requires peer deps: `eslint`, `typescript-eslint`, `@eslint/eslintrc`, `@eslint/js`, `eslint-config-prettier`, `eslint-plugin-prettier`, `globals`.

---

### Static Config Files

JSON config files that can be referenced directly or copied into your project:

| Import path | Description |
|-------------|-------------|
| [`/config/tsconfig.json`](src/config/tsconfig.json) | Base TypeScript config: ES2021 target, CommonJS, decorators, source maps, `skipLibCheck` |
| [`/config/tsconfig.build.json`](src/config/tsconfig.build.json) | Extends base tsconfig, excludes `node_modules`, `dist`, and test files |
| [`/config/nest-cli.json`](src/config/nest-cli.json) | NestJS CLI config: SWC builder with type checking, `@nestjs/swagger` plugin with comment introspection |
| [`/config/swcrc.json`](src/config/swcrc.json) | SWC config: TypeScript with decorator support, source maps, no minification |
| [`/config/prettierrc.json`](src/config/prettierrc.json) | Prettier config: single quotes, trailing commas |

---

## License

MIT
