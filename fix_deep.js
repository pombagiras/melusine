const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);

const replacements = [
  // Combinacoes longas primeiro
  [/ções/g, 'ções'],
  [/ção/g, 'ção'],
  [/ões/g, 'ões'],
  [/ão/g, 'ão'],
  [/ã/g, 'ã'],
  [/õ/g, 'õ'],
  [/á/g, 'á'],
  [/é/g, 'é'],
  [/í/g, 'í'],
  [/ó/g, 'ó'],
  [/ú/g, 'ú'],
  [/â/g, 'â'],
  [/ç/g, 'ç'],
  [/ê/g, 'ê'],
  [/ô/g, 'ô'],
  [/ö/g, 'ö'],
  [/ü/g, 'ü'],
  [/Ç/g, 'Ç'],
  [/Ú/g, 'Ú'],
  [/É/g, 'É'],
  [/Á–/g, 'Ö'],
  [/Á„/g, 'Ä'],
  [/Â/g, 'Â'],
  [/Á /g, 'à'],
  [/nº/g, 'nº'],
  [/º/g, 'º'],
  [/ª/g, 'ª'],
  [/§/g, '§'],
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
