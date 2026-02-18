import type { INestApplication } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';

export function setupValidation(app: INestApplication): void {
  app.useGlobalPipes(new ZodValidationPipe());
}
