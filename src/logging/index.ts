import { Module, type DynamicModule } from '@nestjs/common';
import type { Params as LoggerModuleParams } from 'nestjs-pino';
import { LoggerModule } from 'nestjs-pino';
import { isLocal } from '../env';

export interface CommonLoggerModuleOptions {
  level?: string;
  ignorePaths?: string[];
}

@Module({})
export class CommonLoggerModule {
  static forRoot(opts?: CommonLoggerModuleOptions): DynamicModule {
    return {
      module: CommonLoggerModule,
      imports: [LoggerModule.forRoot(createLoggerConfig(opts))],
    };
  }
}

function createLoggerConfig(
  opts?: CommonLoggerModuleOptions,
): LoggerModuleParams {
  const level = opts?.level ?? process.env.LOG_LEVEL ?? 'info';
  const prettyPrint = isLocal();
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
