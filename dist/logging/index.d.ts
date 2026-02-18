import { DynamicModule } from '@nestjs/common';

interface CommonLoggerModuleOptions {
    level?: string;
    ignorePaths?: string[];
}
declare class CommonLoggerModule {
    static forRoot(opts?: CommonLoggerModuleOptions): DynamicModule;
}

export { CommonLoggerModule, type CommonLoggerModuleOptions };
