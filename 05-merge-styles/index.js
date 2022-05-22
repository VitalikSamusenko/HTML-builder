const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');

async function createBundle(pathToFolder) {
  const items = await fs.promises.readdir(pathToFolder, {withFileTypes: true});
  const ws = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
  items.forEach(item => {
    let pathToItem = path.join(pathToFolder, item.name);
    if (item.isFile() && path.extname(item.name) === '.css'){
      const arr = [];
      const rs = fs.createReadStream(pathToItem , 'utf-8');
      rs.on('data', chunk => arr.push(chunk));
      rs.on('end', () => arr.forEach(el => ws.write(el + '\n')));
      rs.on('error', err => console.log('Error: ', err.message));
    }
  });
}

createBundle(stylesPath);