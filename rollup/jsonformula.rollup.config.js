/* eslint import/no-unresolved: */
import cleanup from 'rollup-plugin-cleanup';
import license from 'rollup-plugin-license';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
// eslint-disable-next-line import/extensions
import { readLicenseFile } from './common';

const pkgname = '@adobe/json-formula';
const directory = `node_modules/${pkgname}`;
const licenseContent = readLicenseFile(pkgname, false);
export default {
  input: {
    'json-formula': path.join(directory, 'src/json-formula.js'),
  },
  plugins: [
    cleanup(),
    license({
      banner: licenseContent,
    }),
  ],
  output: [{
    dir: 'blocks/form/rules/formula',
    format: 'es',
    entryFileNames: 'index.js',
  },
  {
    dir: 'blocks/form/rules/formula',
    format: 'es',
    entryFileNames: 'index.min.js',
    plugins: [terser()],
  }],
};
