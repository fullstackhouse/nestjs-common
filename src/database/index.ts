import { UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import debug from 'debug';
import { parseBoolean } from '../env';

export interface DatabaseConnectionOptions {
  databaseUrl?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  dbName?: string;
  schema?: string;
}

export interface DatabaseConfigOptions extends DatabaseConnectionOptions {
  entitiesPath?: string;
  entitiesTsPath?: string;
  migrationsPath?: string;
  migrationsTsPath?: string;
}

export function createDatabaseConnectionConfig(
  opts: DatabaseConnectionOptions,
) {
  if (process.env.SKIP_DB_CONNECTION === 'true') {
    return {
      host: 'localhost',
      port: 5432,
      user: 'user',
      password: 'password',
      dbName: 'db',
      schema: 'public',
      connect: false,
    };
  }

  if (opts.databaseUrl) {
    const url = new URL(opts.databaseUrl);
    const socketPath = url.searchParams.get('host');
    if (socketPath) {
      return {
        host: socketPath,
        port: 5432,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        dbName: url.pathname.slice(1),
        schema: opts.schema ?? 'public',
      };
    }
    return { clientUrl: opts.databaseUrl, schema: opts.schema ?? 'public' };
  }

  return {
    host: opts.host ?? 'localhost',
    port: opts.port ?? 5432,
    user: opts.user ?? 'postgres',
    password: opts.password ?? 'postgres',
    dbName: opts.dbName ?? 'app',
    schema: opts.schema ?? 'public',
  };
}

export function createDatabaseConfig(opts: DatabaseConfigOptions) {
  const cli = parseBoolean(process.env.CLI) ?? false;
  const entitiesPath = opts.entitiesPath ?? './dist/database/entities';
  const entitiesTsPath = opts.entitiesTsPath ?? './src/database/entities';

  return {
    ...createDatabaseConnectionConfig(opts),
    entities: [`${entitiesPath}/**/*.js`],
    entitiesTs: [`${entitiesTsPath}/**/*.ts`],
    discovery: { warnWhenNoEntities: false },
    debug: debug.enabled('mikro-orm'),
    namingStrategy: UnderscoreNamingStrategy,
    extensions: [Migrator],
    migrations: {
      path: opts.migrationsPath ?? './dist/database/migrations',
      pathTs: opts.migrationsTsPath ?? './src/database/migrations',
    },
    allowGlobalContext: cli,
  };
}
