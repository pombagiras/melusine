const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);

const replacements = [
  // Combinacoes longas primeiro
  [/Ã§Ãµes/g, 'ções'],
  [/Ã§Ã£o/g, 'ção'],
  [/Ãµes/g, 'ões'],
  [/Ã£o/g, 'ão'],
  [/Ã£/g, 'ã'],
  [/Ãµ/g, 'õ'],
  [/Ã¡/g, 'á'],
  [/Ã©/g, 'é'],
  [/Ã­/g, 'í'],
  [/Ã³/g, 'ó'],
  [/Ãº/g, 'ú'],
  [/Ã¢/g, 'â'],
  [/Ã§/g, 'ç'],
  [/Ãª/g, 'ê'],
  [/Ã´/g, 'ô'],
  [/Ã¶/g, 'ö'],
  [/Ã¼/g, 'ü'],
  [/Ã‡/g, 'Ç'],
  [/Ãš/g, 'Ú'],
  [/Ã‰/g, 'É'],
  [/Ã–/g, 'Ö'],
  [/Ã„/g, 'Ä'],
  [/Ã‚/g, 'Â'],
  [/Ã /g, 'à'],
  [/nÂº/g, 'nº'],
  [/Âº/g, 'º'],
  [/Âª/g, 'ª'],
  [/Â§/g, '§'],
  [/Â/g, ''],
  [/\bExplore\b/g, 'Descubra'],
  [/\bexplore\b/g, 'descubra'],
];

let total = 0, updated = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('.') && e.name !== 'node_modules') walk(fp);
    } else if (e.isFile() && e.name.endsWith('.html')) {
      let c = fs.readFileSync(fp, 'utf8');
      const orig = c;
      for (const [from, to] of replacements) c = c.replace(from, to);
      if (c !== orig) {
        fs.writeFileSync(fp, c, 'utf8');
        console.log('Atualizado: ' + path.relative(root, fp));
        updated++;
      }
      total++;
    }
  }
}

walk(root);
console.log('\nConcluido: ' + updated + ' de ' + total + ' arquivos atualizados.');
