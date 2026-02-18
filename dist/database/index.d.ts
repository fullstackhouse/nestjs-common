import { UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';

interface DatabaseConnectionOptions {
    databaseUrl?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    dbName?: string;
    schema?: string;
}
interface DatabaseConfigOptions extends DatabaseConnectionOptions {
    entitiesPath?: string;
    entitiesTsPath?: string;
    migrationsPath?: string;
    migrationsTsPath?: string;
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
declare function createDatabaseConfig(opts: DatabaseConfigOptions): {
    entities: string[];
    entitiesTs: string[];
    discovery: {
        warnWhenNoEntities: boolean;
    };
    debug: boolean;
    namingStrategy: typeof UnderscoreNamingStrategy;
    extensions: (typeof Migrator)[];
    migrations: {
        path: string;
        pathTs: string;
    };
    allowGlobalContext: boolean;
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
    schema: string;
    connect: boolean;
    clientUrl?: undefined;
} | {
    entities: string[];
    entitiesTs: string[];
    discovery: {
        warnWhenNoEntities: boolean;
    };
    debug: boolean;
    namingStrategy: typeof UnderscoreNamingStrategy;
    extensions: (typeof Migrator)[];
    migrations: {
        path: string;
        pathTs: string;
    };
    allowGlobalContext: boolean;
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
    schema: string;
    connect?: undefined;
    clientUrl?: undefined;
} | {
    entities: string[];
    entitiesTs: string[];
    discovery: {
        warnWhenNoEntities: boolean;
    };
    debug: boolean;
    namingStrategy: typeof UnderscoreNamingStrategy;
    extensions: (typeof Migrator)[];
    migrations: {
        path: string;
        pathTs: string;
    };
    allowGlobalContext: boolean;
    clientUrl: string;
    schema: string;
    host?: undefined;
    port?: undefined;
    user?: undefined;
    password?: undefined;
    dbName?: undefined;
    connect?: undefined;
};

export { type DatabaseConfigOptions, type DatabaseConnectionOptions, createDatabaseConfig, createDatabaseConnectionConfig };
