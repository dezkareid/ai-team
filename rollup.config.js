import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' with { type: 'json' };

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {}), 'fs/promises', 'path', 'fs', 'url'];

export default [
  {
    input: 'src/scripts/sync-version.ts',
    output: {
      file: 'dist/scripts/sync-version.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
    ],
    external,
  },
];
