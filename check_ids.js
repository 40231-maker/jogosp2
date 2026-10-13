const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');
const used = new Set([
  ...[...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]),
  ...[...js.matchAll(/querySelector\(['"]#([^'" >:]+)['"]\)/g)].map(m => m[1])
]);
const missing = [...used].filter(id => !html.includes(`id="${id}"`) && !html.includes(`id='${id}'`));
console.log('IDs usados:', used.size);
console.log('IDs ausentes no HTML:', missing.length ? missing.join(', ') : 'nenhum detectado');
if (missing.length) process.exitCode = 1;
