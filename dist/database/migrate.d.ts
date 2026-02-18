import { Options } from '@mikro-orm/postgresql';

interface MigrateOptions {
    disableCustomSchema?: boolean;
    direction?: 'up' | 'down';
    to?: string;
    from?: string;
    only?: string[];
}
declare function parseMigrateArgs(argv?: string[]): MigrateOptions;
declare function runMigrations(config: Options, options: MigrateOptions): Promise<void>;

export { type MigrateOptions, parseMigrateArgs, runMigrations };
