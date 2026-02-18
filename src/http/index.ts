import type { Request } from 'express';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getRequestClientIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim();
  }
  return req.socket.remoteAddress;
}

export function createCorsConfig(opts: {
  appEnv: string;
  allowedOrigins: string[];
}): CorsOptions {
  return {
    origin: opts.appEnv === 'local' ? true : opts.allowedOrigins,
    credentials: true,
  };
}
