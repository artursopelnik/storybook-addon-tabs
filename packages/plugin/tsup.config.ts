import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  target: 'es2020',
  treeshake: true,
  banner: {
    js: '/* storybook-tabs — Docusaurus-style tabs for Storybook MDX */',
  },
});
