interface GenerateMetadataOptions {
    rootDir: string;
}
declare function generateMetadata(opts: GenerateMetadataOptions): void;

export { type GenerateMetadataOptions, generateMetadata };
