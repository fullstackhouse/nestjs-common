import { Request } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

declare function getRequestClientIp(req: Request): string | undefined;
declare function createCorsConfig(opts: {
    appEnv: string;
    allowedOrigins: string[];
}): CorsOptions;

export { createCorsConfig, getRequestClientIp };
