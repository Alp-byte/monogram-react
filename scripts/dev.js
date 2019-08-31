const fs = require('fs-extra');

const paths = require('../config/paths');

(async function dev() {
  await fs.ensureDirSync(paths.devBuild);
  await fs.emptyDirSync(paths.devBuild);
  await fs.copySync(paths.appPublic, paths.devBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
})();
