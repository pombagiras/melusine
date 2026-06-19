// fix_pontual.js
// Corrige erros pontuais restantes vistos nas capturas de tela
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);

const replacements = [
  // Traço longo corrompido (visto na captura: "–")
  [/–/g, '\u2013'],
  [/”\u0094/g, '\u2013'],
  // Aspas corrompidas restantes
  [/“/g, '\u201C'],
  [/”\u009D/g, '\u201D'],
  [/”/g, '\u201D'],
  // Bullet corrompido
  [/”¢/g, '\u2022'],
  // "respeito à  cultura" -> "respeito à cultura"
  [/respeito à /g, 'respeito \u00E0 '],
  // Signo Libra corrompido: "♎" -> "♎"
  [/♎/g, '\u264E'],
  // Seta corrompida vista em "←⊡ Voltar"
  [/\u2190/g, '\u2190'],
  [/â\u2020/g, ''],
  // Emoji de estrela corrompido "⭐"
  [/⭐/g, '\u2B50'],
  // " sequências corrompidas -> remover
  [/[¥€Ž¨"…•°ï¸¥]+/g, ''],
  [//g, ''],
  // "à" (a com acento grave) -> "à"
  [/à/g, '\u00E0'],
  // "Español" -> "Español"
  [/Español/g, 'Espa\u00F1ol'],
  // Caracteres  soltos restantes
  [/nº/g, 'n\u00BA'],
  [/°/g, '\u00B0'],
  [//g, ''],
];

let total = 0, updated = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('.') && e.name !== 'node_modules') walk(fp);
    } else if (e.isFile() && (e.name.endsWith('.html') || e.name.endsWith('.js'))) {
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
