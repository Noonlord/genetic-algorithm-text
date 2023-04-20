const path = require('path');

const buildPrettierCommand = (filenames) => `prettier --write ${filenames.join(' ')}`;

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx,vue}': [buildPrettierCommand, buildEslintCommand]
};
