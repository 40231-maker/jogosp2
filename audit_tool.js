const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

// Find all document.getElementById in js
const getElemMatches = [...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const queryMatches = [...js.matchAll(/querySelector\(['"]#([^'" >:]+)['"]\)/g)].map(m => m[1]);
const allUsedIds = [...new Set([...getElemMatches, ...queryMatches])];

const missingIds = [];
for (const id of allUsedIds) {
  if (!html.includes('id="' + id + '"') && !html.includes("id='" + id + "'")) {
    missingIds.push(id);
  }
}
console.log('Total IDs referenced in JS:', allUsedIds.length);
console.log('Missing IDs in HTML:', missingIds);
