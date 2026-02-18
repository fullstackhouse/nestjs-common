declare function parseBoolean(value: string | undefined): boolean | undefined;
declare function getAppEnv(): string;
declare function isLocal(): boolean;

export { getAppEnv, isLocal, parseBoolean };
