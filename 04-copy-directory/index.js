const fs = require('fs/promises');
const path = require('path');
const mainFolder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

async function copyDir(mF, cF) {
  try {
    await fs.rm(cF, { recursive: true, force: true });
    await fs.mkdir(cF);
    const folderItems = await fs.readdir(mF, { withFileTypes: true });
    folderItems.forEach(item => {
      if (item.isFile()) {
        fs.copyFile(path.join(mF, item.name), path.join(cF, item.name));
      }
      if (item.isDirectory()){
        copyDir(path.join(mF, item.name), path.join(cF, item.name));
      }
    });
  } catch (err) {
    console.log('Error: ', err);
  }
}

copyDir(mainFolder, copiedFolder);