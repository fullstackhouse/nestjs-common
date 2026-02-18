export function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === '1' || value === 'true') {
    return true;
  }
  if (value === '0' || value === 'false') {
    return false;
  }
  return undefined;
}

export function getAppEnv(): string {
  return process.env.APP_ENV ?? 'prod';
}

export function isLocal(): boolean {
  return getAppEnv() === 'local';
}
