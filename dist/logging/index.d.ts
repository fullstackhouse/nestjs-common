import { Params } from 'nestjs-pino';

interface CreateLoggerConfigOptions {
    level?: string;
    prettyPrint?: boolean;
    ignorePaths?: string[];
}
declare function createLoggerConfig(opts?: CreateLoggerConfigOptions): Params;

export { type CreateLoggerConfigOptions, createLoggerConfig };
