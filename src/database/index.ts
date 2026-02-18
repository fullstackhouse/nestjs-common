export interface DatabaseConnectionOptions {
  databaseUrl?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  dbName?: string;
  schema?: string;
}

export function createDatabaseConnectionConfig(opts: DatabaseConnectionOptions) {
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
