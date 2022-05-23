const path = require('path');
const fs = require('fs');
const {
  rm,
  mkdir,
  readdir,
  readFile,
  writeFile,
  copyFile,
} = require('fs/promises');
const pathToProject = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');

async function buildHtml() {
  let templatePage = await readFile(path.join(__dirname, 'template.html'), 'utf8');
  const pathToComponents = path.join(__dirname, 'components');
  const files = await readdir(pathToComponents, { withFileTypes: true });
  files.forEach(async file => {
    const filePath = path.join(pathToComponents, file.name);
    const fileExt = path.extname(file.name);
    const template = '{{' + file.name.split('.')[0] + '}}';
    const componentData = await readFile(filePath, 'utf8');

    if (templatePage.includes(template) && fileExt === '.html') {
      templatePage = templatePage.replace(template, componentData);
      await writeFile((path.join(__dirname, 'project-dist', 'index.html')), templatePage);
    }
  });

}

async function createStylesBundle(pathToFolder) {
  const items = await readdir(pathToFolder, {withFileTypes: true});
  const ws = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
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

async function copyDir(mainFolder, copiedFolder) {

  await rm(copiedFolder, { recursive: true, force: true });
  await mkdir(copiedFolder);
  const folderItems = await readdir(mainFolder, { withFileTypes: true });
  folderItems.forEach(item => {
    if (item.isFile()) {
      copyFile(path.join(mainFolder, item.name), path.join(copiedFolder, item.name));
    }
    if (item.isDirectory()){
      copyDir(path.join(mainFolder, item.name), path.join(copiedFolder, item.name));
    }
  });

}

async function buildPage() {
  await rm(pathToProject, { recursive: true, force: true });
  await mkdir(pathToProject);
  buildHtml();
  createStylesBundle(stylesPath);
  copyDir(path.join(__dirname, 'assets'), path.join(pathToProject, 'assets'));
}

buildPage();