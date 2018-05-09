import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import eslint from 'rollup-plugin-eslint';
import clean from 'rollup-plugin-clean';

export default {
  input: './src/index.js',

  output: [
    {
      name: 'AccessibleReactCheckboxGroup',
      sourceMap: 'true',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      format: 'umd',
      file: './lib/index.js',
    },
    {
      sourceMap: 'true',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      format: 'es',
      file: './lib/index.module.js',
    },
  ],

  plugins: [
    clean(),
    eslint(),
    postcss({
      modules: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    resolve(),
    commonjs(),
  ],

  external: ['react', 'react-dom'],
};
