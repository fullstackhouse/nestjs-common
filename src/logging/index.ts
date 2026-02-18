import type { Params as LoggerModuleParams } from 'nestjs-pino';

export interface CreateLoggerConfigOptions {
  level?: string;
  prettyPrint?: boolean;
  ignorePaths?: string[];
}

export function createLoggerConfig(
  opts?: CreateLoggerConfigOptions,
): LoggerModuleParams {
  const level = opts?.level ?? 'info';
  const prettyPrint = opts?.prettyPrint ?? false;
  const ignorePaths = opts?.ignorePaths ?? ['/health'];

  return {
    pinoHttp: {
      level,
      transport: prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              ignore: 'pid,hostname',
            },
          }
        : undefined,
      autoLogging: {
        ignore: (req) =>
          ignorePaths.some((p) => req.url?.startsWith(p) ?? false),
      },
    },
  };
}
