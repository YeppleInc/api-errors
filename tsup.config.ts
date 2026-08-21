import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
    splitting: true,
    entry: ['src/**/*.ts'],
    format: ['esm'],
    dts: true,
    minify: true,
    sourcemap: true,
    clean: true,
    ...options
}));
