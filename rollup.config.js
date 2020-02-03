import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main.replace('.min', ''),
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['@opentok/client', 'react'],
  plugins: [
    external(),
    url({ exclude: ['**/*.svg'] }),
    babel(),
    resolve(),
    commonjs(),
    terser({
      include: [/^.+\.min\.js$/],
    }), // minify bundle files
  ],
};
