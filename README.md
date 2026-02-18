# @fullstackhouse/nestjs-common

Common utilities for building NestJS backends. Provides reusable modules, configuration presets, and helpers extracted from production projects.

## Installation

```bash
pnpm add @fullstackhouse/nestjs-common
```

All dependencies are optional peers — install only what you use.

## Modules

| Import | Description |
|--------|-------------|
| `@fullstackhouse/nestjs-common/env` | `parseBoolean`, `getAppEnv`, `isLocal` |
| `@fullstackhouse/nestjs-common/http` | `getRequestClientIp` |
| `@fullstackhouse/nestjs-common/sentry` | `initSentry`, `SentryExceptionFilter`, `SentryModule` |
| `@fullstackhouse/nestjs-common/logging` | `CommonLoggerModule` (pino-based) |
| `@fullstackhouse/nestjs-common/cls` | `setupCls` |
| `@fullstackhouse/nestjs-common/validation` | `setupValidation` (Zod pipes) |
| `@fullstackhouse/nestjs-common/database` | `createDatabaseConfig`, `createDatabaseConnectionConfig` |
| `@fullstackhouse/nestjs-common/database/migrate` | `runMigrations`, `parseMigrateArgs` |
| `@fullstackhouse/nestjs-common/health` | `HealthModule` (DB ping endpoint) |
| `@fullstackhouse/nestjs-common/testing` | Testing utilities |
| `@fullstackhouse/nestjs-common/testing/setup` | Test setup (dotenv + reflect-metadata) |

## Configuration Presets

| Import | Description |
|--------|-------------|
| `@fullstackhouse/nestjs-common/config/vitest` | `createVitestConfig` |
| `@fullstackhouse/nestjs-common/config/eslint` | `createEslintConfig` |
| `@fullstackhouse/nestjs-common/config/tsconfig.json` | Base tsconfig |
| `@fullstackhouse/nestjs-common/config/tsconfig.build.json` | Build tsconfig |
| `@fullstackhouse/nestjs-common/config/nest-cli.json` | NestJS CLI config |
| `@fullstackhouse/nestjs-common/config/swcrc.json` | SWC config |
| `@fullstackhouse/nestjs-common/config/prettierrc.json` | Prettier config |

## License

MIT
