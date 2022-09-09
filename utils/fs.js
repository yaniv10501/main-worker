const fs = require('fs');
const path = require('path');

module.exports.checkExistingPhotos = (filePath) => {
  const photosList = new Set();
  const photosPath = path.join(__dirname, filePath);
  fs.readdirSync(photosPath).forEach((file) => {
    if (file.match(/((.png))|(.jpg)|(.jpeg)$/)) {
      photosList.add(file.replace('-768x432', ''));
    }
  });
  return [...photosList];
};

module.exports.readJsonFileSync = (filePath) =>
  fs.readFileSync(path.join(__dirname, filePath), 'utf-8');

module.exports.updateJsonMessages = (filePath, callBack) =>
  fs.readFile(path.join(__dirname, filePath), 'utf-8', callBack);

module.exports.writeJsonFile = (filePath, info, options) => {
  const dirname = path.join(__dirname, path.dirname(filePath));

  if (!fs.existsSync(dirname)) {
    const parentDirectory = path.dirname(dirname);
    if (!fs.existsSync(parentDirectory)) {
      fs.mkdirSync(parentDirectory);
    }
    fs.mkdirSync(dirname);
  }

  if (options === 'sync') {
    return fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(info), 'utf-8');
  }
  return fs.writeFile(path.join(__dirname, filePath), JSON.stringify(info), 'utf-8', (err) => {
    if (err) throw err;
  });
};

module.exports.checkFilePathExists = (filePath) => fs.existsSync(path.join(__dirname, filePath));
