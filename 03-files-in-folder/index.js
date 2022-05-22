const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log('Error: ', err.message);
  } else {
    files.forEach(file => {
      if (file.isFile()){
        let fFolder = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(fFolder, (err, stats) => {
          if (err) console.log('Error: ', err.message);
          let fName = file.name.split('.')[0];
          let fExt = path.extname(file.name).split('.')[1];
          let fSize = (stats.size / 1024).toFixed(3);
          console.log(fName + ' - ' + fExt + ' - ' + fSize+'kb');
        });
      }
    });
  }
});