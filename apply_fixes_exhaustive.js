// apply_fixes_exhaustive.js
// Exhaustive script to replace English words, UI phrases, and fix UTF-8 encoding issues across all HTML files.
// Run with: node apply_fixes_exhaustive.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);

// Mapping of patterns to replacements (case‑insensitive where appropriate)
const replacements = [
  // General UI text
  { from: /Explore/g, to: 'Descubra' },
  { from: /Explore a/g, to: 'Descubra a' },
  { from: /Explore o/g, to: 'Descubra o' },
  { from: /Explore as/g, to: 'Descubra as' },
  { from: /Explore as/g, to: 'Descubra as' },
  { from: /Explore the/g, to: 'Descubra o' },
  { from: /Explore the/g, to: 'Descubra o' },
  { from: /Explore the/g, to: 'Descubra o' },
  { from: /Explore the/g, to: 'Descubra o' },
  { from: /Explore the/g, to: 'Descubra o' },
  { from: /Learn/g, to: 'Aprenda' },
  { from: /Visit/g, to: 'Visite' },
  { from: /Click/g, to: 'Clique' },
  { from: /English/g, to: 'Inglês' },
  { from: /Spanish/g, to: 'Espanhol' },
  { from: /Português/g, to: 'Português' }, // keep correct
  // Fix common UTF‑8 mis‑encodings
  { from: /Ã¡/g, to: 'á' },
  { from: /Ã©/g, to: 'é' },
  { from: /Ã­/g, to: 'í' },
  { from: /Ã³/g, to: 'ó' },
  { from: /Ãº/g, to: 'ú' },
  { from: /Ã¢/g, to: 'â' },
  { from: /Ã£/g, to: 'ã' },
  { from: /Ã§/g, to: 'ç' },
  { from: /Ãª/g, to: 'ê' },
  { from: /Ã´/g, to: 'ô' },
  { from: /Ã¶/g, to: 'ö' },
  { from: /Ã¼/g, to: 'ü' },
  { from: /Ã‘/g, to: 'Ñ' },
  { from: /Ã‡/g, to: 'Ç' },
  { from: /Ã/g, to: 'Á' },
  { from: /Ã‰/g, to: 'É' },
  { from: /Ã/g, to: 'Í' },
  { from: /Ã“O/g, to: 'Ó' },
  { from: /Ãš/g, to: 'Ú' },
  { from: /Ã‚/g, to: 'Â' },
  { from: /Ã„/g, to: 'Ä' },
  { from: /Ã–/g, to: 'Ö' },
  { from: /Ãœ/g, to: 'Ü' },
  // Misc Portuguese refinements
  { from: /\bpt‑BR\b/g, to: 'pt‑BR' },
  { from: /\bpt-BR\b/g, to: 'pt‑BR' },
  { from: /\bPT‑BR\b/g, to: 'pt‑BR' },
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
      if (entry.name.startsWith('.')) continue; // skip hidden dirs
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

walk(root);
console.log('Todas as substituições exaustivas concluídas.');
