const path = require('path');
const { build } = require('../builder');

build({
  entry: path.resolve(__dirname, './proj'),
  out: path.resolve(__dirname, './dist'),
});
