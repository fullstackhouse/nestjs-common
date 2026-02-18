import type { MikroORM, Transaction, Options } from '@mikro-orm/postgresql';

export interface MigrateOptions {
  disableCustomSchema?: boolean;
  direction?: 'up' | 'down';
  to?: string;
  from?: string;
  only?: string[];
}

interface MigratorUpDownOptions {
  to?: string | number;
  from?: string | number;
  migrations?: string[];
  transaction?: Transaction;
}

function buildMigratorOptions(options: MigrateOptions): MigratorUpDownOptions {
  const { to, from, only } = options;
  const migrateOpts: MigratorUpDownOptions = {};

  if (to !== undefined) {
    migrateOpts.to = to === '0' ? 0 : to;
  }
  if (from !== undefined) {
    migrateOpts.from = from === '0' ? 0 : from;
  }
  if (only && only.length > 0) {
    migrateOpts.migrations = only;
  }

  return migrateOpts;
}

export function parseMigrateArgs(argv: string[] = process.argv): MigrateOptions {
  const args = argv.slice(2);

  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    console.log('Usage: migrate <up|down> [options]');
    console.log('  --disable-custom-schema  Use default public schema');
    console.log('  -t, --to <version>       Migrate to specific version');
    console.log('  -f, --from <version>     Migrate from specific version');
    console.log(
      '  -o, --only <versions>    Only specified versions (comma separated)',
    );
    process.exit(args.length === 0 ? 1 : 0);
  }

  const direction = args[0];
  if (direction !== 'up' && direction !== 'down') {
    console.error(
      `Invalid direction "${String(direction)}". Must be "up" or "down"`,
    );
    process.exit(1);
  }

  const parsed: MigrateOptions = { direction, disableCustomSchema: false };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--disable-custom-schema') {
      parsed.disableCustomSchema = true;
    } else if (arg === '-t' || arg === '--to') {
      parsed.to = args[++i];
    } else if (arg.startsWith('--to=')) {
      parsed.to = arg.split('=')[1];
    } else if (arg === '-f' || arg === '--from') {
      parsed.from = args[++i];
    } else if (arg.startsWith('--from=')) {
      parsed.from = arg.split('=')[1];
    } else if (arg === '-o' || arg === '--only') {
      parsed.only = args[++i].split(/[, ]+/);
    } else if (arg.startsWith('--only=')) {
      parsed.only = arg.split('=')[1].split(/[, ]+/);
    }
  }

  return parsed;
}

export async function runMigrations(
  config: Options,
  options: MigrateOptions,
): Promise<void> {
  const { disableCustomSchema = false, direction = 'up' } = options;
  const schema = (config.schema as string) ?? 'public';
  const targetSchema = disableCustomSchema ? 'public' : schema;
  const useCustomSchema = targetSchema !== 'public' && !disableCustomSchema;

  console.log('==================');
  console.log('Database Migration');
  console.log('==================');
  console.log(`Direction: ${direction}`);
  console.log(`Target schema: ${targetSchema}`);
  console.log('');

  const { MikroORM } = await import('@mikro-orm/postgresql');
  let orm: MikroORM | undefined;

  try {
    orm = await MikroORM.init({
      ...config,
      schema,
      pool: { min: 1, max: 2 },
    });

    const migrateOpts = buildMigratorOptions(options);
    const connection = orm.em.getConnection();

    await connection.transactional(async (trx) => {
      if (useCustomSchema) {
        console.log(`Setting search_path to '${targetSchema}'...`);
        await connection.execute(
          `SET search_path TO ??`,
          [targetSchema],
          undefined,
          trx,
        );
        migrateOpts.transaction = trx;
      }

      if (direction === 'up') {
        const pending = await orm!.migrator.getPendingMigrations();
        if (pending.length === 0) {
          console.log('No pending migrations to execute');
          return;
        }
        console.log(`Found ${pending.length} pending migration(s)`);
        const result = await orm!.migrator.up(migrateOpts);
        if (result.length > 0) {
          console.log(`Successfully executed ${result.length} migration(s)`);
        }
      } else {
        const result = await orm!.migrator.down(migrateOpts);
        if (result.length > 0) {
          console.log(`Successfully rolled back ${result.length} migration(s)`);
        }
      }
    });

    console.log('');
    console.log('Migration completed successfully!');

    await orm.close(true);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed');
    console.error(error);

    if (orm) {
      await orm.close(true);
    }

    process.exit(1);
  }
}
