interface DatabaseConnectionOptions {
    databaseUrl?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    dbName?: string;
    schema?: string;
}
declare function createDatabaseConnectionConfig(opts: DatabaseConnectionOptions): {
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
    schema: string;
    connect: boolean;
    clientUrl?: undefined;
} | {
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
    schema: string;
    connect?: undefined;
    clientUrl?: undefined;
} | {
    clientUrl: string;
    schema: string;
    host?: undefined;
    port?: undefined;
    user?: undefined;
    password?: undefined;
    dbName?: undefined;
    connect?: undefined;
};

export { type DatabaseConnectionOptions, createDatabaseConnectionConfig };
