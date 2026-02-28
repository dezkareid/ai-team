import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
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
      json(),
      typescript(),
      resolve(),
      commonjs(),
    ],
    external,
  },
  {
    input: 'src/cli/export-claude.ts',
    output: {
      file: 'dist/cli/export-claude.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      json(),
      typescript(),
      resolve(),
      commonjs(),
    ],
    external,
  },
  {
    input: 'src/scripts/distribute-mcp.ts',
    output: {
      file: 'dist/scripts/distribute-mcp.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      json(),
      typescript(),
      resolve(),
      commonjs(),
    ],
    external,
  },
  {
    input: 'src/mcp-server/index.ts',
    output: {
      file: 'dist/mcp-server/index.js',
      format: 'esm',
      sourcemap: true,
      banner: '#!/usr/bin/env node',
    },
    plugins: [
      json(),
      typescript(),
      resolve(),
      commonjs(),
    ],
    external,
  },
];
