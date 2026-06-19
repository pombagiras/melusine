// apply_fixes.js
// Script to replace English words with Portuguese equivalents across all HTML files
// Run with: node apply_fixes.js
const fs = require('fs');
const path = require('path');

// Project root directory (the folder containing this script)
const root = path.resolve(__dirname);

// Mapping of words/phrases to replace (regular expressions are case‑sensitive; add /i if needed)
const replacements = [
  { from: /Explore/g, to: 'Descubra' },
  { from: /Explore a/g, to: 'Descubra a' },
  { from: /Explore o/g, to: 'Descubra o' },
  { from: /explore/g, to: 'descubra' },
  { from: /English/g, to: 'Português' },
  { from: /Spanish/g, to: 'Português' },
  { from: /Learn/g, to: 'Aprenda' },
  { from: /Visit/g, to: 'Visite' },
  // UTF‑8 encoding fixes
  { from: /Ã©/g, to: 'é' },
  { from: /Ã¡/g, to: 'á' },
  { from: /Ã§/g, to: 'ç' },
  { from: /Ã£/g, to: 'ã' },
  { from: /Ã¶/g, to: 'ö' },
  { from: /Ã¼/g, to: 'ü' },
  { from: /Ã­/g, to: 'í' },
  { from: /Ã³/g, to: 'ó' },
  { from: /Ãº/g, to: 'ú' },
  { from: /Ãª/g, to: 'ê' },
  { from: /Ã´/g, to: 'ô' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Atualizado: ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Ignore hidden/system directories
      if (entry.name.startsWith('.')) continue;
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

walk(root);
console.log('Todas as substituições foram concluídas.');
