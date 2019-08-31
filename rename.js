var fs = require('fs');

const START_NUMBER = 166;
const FOLDER_PATH = './src/assets/test';
fs.readdir(FOLDER_PATH, (err, files) => {
  files.sort((a, b) => {
    return a.split('.')[0] - b.split('.')[0];
  });

  for (let index = 0; index < files.length / 2; index++) {
    const file = index * 2;
    console.log(
      `FILE INDEX = ${file}`,
      `LOOP INDEX ( RENAME NUMBER ) = ${index}`
    );

    const firstFileExtension = files[file].split('.')[1];
    const secondFileExtension = files[file + 1].split('.')[1];
    fs.renameSync(
      `${FOLDER_PATH}/${files[file]}`,
      `${FOLDER_PATH}/${index + START_NUMBER}.${firstFileExtension}`
    );
    fs.renameSync(
      `${FOLDER_PATH}/${files[file + 1]}`,
      `${FOLDER_PATH}/${index + START_NUMBER}.${secondFileExtension}`
    );
  }
});
