import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';
import { join } from 'path';

export interface GenerateMetadataOptions {
  rootDir: string;
}

export function generateMetadata(opts: GenerateMetadataOptions): void {
  const generator = new PluginMetadataGenerator();
  generator.generate({
    visitors: [
      new ReadonlyVisitor({
        introspectComments: true,
        pathToSource: join(opts.rootDir, 'src'),
        classValidatorShim: false,
      }),
    ],
    outputDir: join(opts.rootDir, 'src'),
    watch: false,
    tsconfigPath: 'tsconfig.json',
  });
}
