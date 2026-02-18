import { Request } from 'express';

declare function getRequestClientIp(req: Request): string | undefined;

export { getRequestClientIp };
