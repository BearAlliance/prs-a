let fs = require('fs');
let glob = require('glob');

console.log('building');

deleteFolderRecursive('dist/');
copyFirefoxSource();
copyLibraries();


function copyFirefoxSource() {
  fs.mkdirSync('dist/');
  fs.mkdirSync('dist/firefox/');
  fs.mkdirSync('dist/firefox/options');

  let files = glob.sync('firefox/**/*.*');
  console.log('files', files);
  files.forEach((fileLoc) => {
    copyFile(fileLoc, `dist/${fileLoc}`)
      .catch(e => console.error(e));
  });
}

function copyLibraries() {
  fs.mkdirSync('dist/firefox/lib');
  copyFile(
    'node_modules/log4javascript/log4javascript.js',
    'dist/firefox/lib/log4javascript.js'
  );
}

function copyFile(source, target) {
  let rd = fs.createReadStream(source);
  let wr = fs.createWriteStream(target);
  return new Promise((resolve, reject) => {
    rd.on('error', reject);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  }).catch((error) => {
    rd.destroy();
    wr.end();
    throw error;
  });
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      let curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}