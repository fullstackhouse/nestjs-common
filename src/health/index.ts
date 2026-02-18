import { Controller, Get, Module } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MikroOrmHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';

@Controller('health')
class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MikroOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiResponse({ status: 200 })
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
