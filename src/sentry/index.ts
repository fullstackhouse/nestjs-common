import { ArgumentsHost, HttpException, Module } from '@nestjs/common';
import { type DynamicModule } from '@nestjs/common';
import { APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SentryModule } from '@sentry/nestjs/setup';
type SentryInitOptions = Parameters<typeof Sentry.init>[0];

export type InitSentryOptions = {
  filter4xx?: boolean;
} & SentryInitOptions;

export function initSentry(opts: InitSentryOptions): void {
  const { filter4xx = true, ...sentryOpts } = opts;

  Sentry.init({
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,
    integrations: [nodeProfilingIntegration()],
    ...sentryOpts,
    beforeSend(event, hint) {
      if (filter4xx) {
        const error = hint.originalException;
        if (error instanceof HttpException && error.getStatus() < 500) {
          return null;
        }
      }
      return sentryOpts.beforeSend?.(event, hint) ?? event;
    },
  });
}

export class SentryExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Sentry.captureException(exception);
    return super.catch(exception, host);
  }
}

export { SentryModule };

@Module({})
export class CommonSentryModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonSentryModule,
      imports: [SentryModule.forRoot()],
      providers: [{ provide: APP_FILTER, useClass: SentryExceptionFilter }],
    };
  }
}
