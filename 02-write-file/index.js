const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const ws = fs.createWriteStream(path.join(__dirname, 'f.txt'));

stdout.write('Введите текст: ');
stdin.on('data', (data) => {
  if (data.toString().trim() !== 'exit') {
    ws.write(data.toString());
  } else {
    stdout.write('Прощайте :)');
    process.exit();
  }
});
process.on('SIGINT', () => {
  stdout.write('Прощайте :)');
  process.exit();
});
