const path = require('path');
const fs = require('fs-extra');

[
  [
    path.resolve(__dirname, '../packages/wxml/src'),
    path.resolve(__dirname, '../packages/builder/src/wxml-lib'),
  ],
  [
    path.resolve(__dirname, '../packages/runtime'),
    path.resolve(__dirname, '../packages/example/runtime'),
  ],
].forEach(([from, to]) => {
  console.log(`Create soft link from "${from}" to "${to}"`);
  if (fs.existsSync(to)) {
    fs.unlinkSync(to);
  }
  fs.symlinkSync(from, to);
});
