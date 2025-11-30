const fs = require('fs');
const path = require('path');

const outputDir = './output';
const files = fs.readdirSync(outputDir).filter(f => f.startsWith('page-'));

console.log('\nExtracted Pages:\n');
console.log('ID    | Title                                    | Size');
console.log('------|------------------------------------------|--------');

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(outputDir, file)));
  const size = fs.statSync(path.join(outputDir, file)).size;
  const id = String(data.id).padStart(5, ' ');
  const title = data.title.substring(0, 40).padEnd(40, ' ');
  const sizeKb = (size / 1024).toFixed(1) + 'KB';
  console.log(`${id} | ${title} | ${sizeKb}`);
});

console.log('\n');
