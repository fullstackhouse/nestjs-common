import { DynamicModule, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
export { SentryModule } from '@sentry/nestjs/setup';

type SentryInitOptions = Parameters<typeof Sentry.init>[0];
type InitSentryOptions = {
    filter4xx?: boolean;
} & SentryInitOptions;
declare function initSentry(opts: InitSentryOptions): void;
declare class SentryExceptionFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}

declare class CommonSentryModule {
    static forRoot(): DynamicModule;
}

export { CommonSentryModule, type InitSentryOptions, SentryExceptionFilter, initSentry };
