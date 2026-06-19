// fix_all_encoding.js
// Script robusto e dinâmico para corrigir todas as corrupções de encoding (UTF-8 interpretado como Windows-1252)
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);

// Tabela de mapeamento de bytes para caracteres do Windows-1252 (incluindo tratamento de não designados)
const cp1252Bytes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
  64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
  80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
  96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
  112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
  0x20AC, 0x81, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0x8D, 0x017D, 0x8F,
  0x90, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x9D, 0x017E, 0x0178,
  0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xAB, 0xAC, 0xAD, 0xAE, 0xAF,
  0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xBB, 0xBC, 0xBD, 0xBE, 0xBF,
  0xC0, 0xC1, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xCB, 0xCC, 0xCD, 0xCE, 0xCF,
  0xD0, 0xD1, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xDB, 0xDC, 0xDD, 0xDE, 0xDF,
  0xE0, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xEF,
  0xF0, 0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF
];

// Mapeamento inverso de caracteres Unicode para bytes do Windows-1252
const unicodeToCp1252 = new Map();
for (let i = 0; i < 256; i++) {
  unicodeToCp1252.set(cp1252Bytes[i], i);
}

function charToByte(c) {
  const code = c.charCodeAt(0);
  if (unicodeToCp1252.has(code)) {
    return unicodeToCp1252.get(code);
  }
  if (code < 256) {
    return code;
  }
  return null; // Não pode ser mapeado para um único byte CP1252
}

// Conjunto de caracteres/strings UTF-8 decodificados permitidos (para segurança máxima)
const allowedTargets = new Set([
  // Letras acentuadas portuguesas
  'á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'ô', 'ã', 'õ', 'à', 'ç',
  'Á', 'É', 'Í', 'Ó', 'Ú', 'Â', 'Ê', 'Ô', 'Ã', 'Õ', 'À', 'Ç',
  'ñ', 'Ñ', 'º', 'ª', '§', '°',
  // Símbolos e pontuações
  '—', '–', '•', '…', '’', '‘', '“', '”', '™', '×',
  // Emojis e símbolos espirituais/astrológicos
  '🥀', '🔱', '💄', '🎴', '🏆', '🎯', '📡', '🔴', '📜', '🗝️', '🗝', '✍️', '✍', '✉️', '✉',
  '🌹', '🌸', '🌕', '🌙', '🌊', '🌋', '🌟', '🌿', '🍂', '🍃',
  '🦋', '🕯', '🕸', '🔥', '💫', '👀', '💋', '💜', '💓', '💔',
  '💕', '💗', '💘', '💙', '💚', '💛', '💞', '💡', '💥', '💦',
  '💧', '💪', '💃', '🕺', '🥂', '🍷', '🍸', '🍹', '🍺', '🍻',
  '🌍', '✨', '🙏', '⚔', '⚔️', '⚖', '♥', '♦', '♣', '♠', '♀', '♂',
  '☽', '☾', '★', '☆', '☯', '♾', '⭐', '♎',
  // Emojis recém-descobertos
  '🌐', '🌺', '🥃', '🎨', '📅', '🕰', '🕰️',
  // Caracteres especiais de controle/variação
  '\uFE0F', '\u200D'
]);

function repairString(str) {
  let result = '';
  let i = 0;
  while (i < str.length) {
    const c1 = str[i];
    const b1 = charToByte(c1);

    if (b1 === null) {
      result += c1;
      i++;
      continue;
    }

    // Identificar tamanho de sequência de bytes UTF-8 (2, 3 ou 4 bytes)
    let utf8Len = 0;
    if (b1 >= 0xC0 && b1 <= 0xDF) utf8Len = 2;
    else if (b1 >= 0xE0 && b1 <= 0xEF) utf8Len = 3;
    else if (b1 >= 0xF0 && b1 <= 0xF7) utf8Len = 4;

    if (utf8Len > 0 && i + utf8Len <= str.length) {
      const bytes = [b1];
      let valid = true;
      for (let j = 1; j < utf8Len; j++) {
        const bj = charToByte(str[i + j]);
        // Bytes de continuação devem estar na faixa 0x80 a 0xBF
        if (bj === null || bj < 0x80 || bj > 0xBF) {
          valid = false;
          break;
        }
        bytes.push(bj);
      }

      if (valid) {
        try {
          const buf = Buffer.from(bytes);
          const decoded = buf.toString('utf8');
          // Garantir que a decodificação seja válida, não vazia, e esteja na nossa lista permitida
          if (decoded && decoded !== '\uFFFD' && decoded !== str.substring(i, i + utf8Len)) {
            // Verificar se o caractere decodificado é permitido
            let isAllowed = false;
            // Para strings com múltiplos caracteres (como emojis compostos), verificar cada um
            for (const char of decoded) {
              if (allowedTargets.has(char) || allowedTargets.has(decoded)) {
                isAllowed = true;
                break;
              }
            }
            if (isAllowed) {
              result += decoded;
              i += utf8Len;
              continue;
            }
          }
        } catch (e) {
          // Fallback silencioso em caso de falha de decodificação
        }
      }
    }

    result += c1;
    i++;
  }
  return result;
}

let total = 0, updated = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Corrigir dinamicamente as sequências corrompidas no conteúdo
  content = repairString(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Corrigido: ' + path.relative(root, filePath));
    updated++;
  }
  total++;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Ignorar diretórios ocultos, node_modules e dist
      if (!e.name.startsWith('.') && e.name !== 'node_modules' && e.name !== 'dist') {
        walk(fp);
      }
    } else if (e.isFile() && (e.name.endsWith('.html') || e.name.endsWith('.js') || e.name.endsWith('.css'))) {
      // Pular os próprios scripts auxiliares e de correção
      if (
        e.name === 'fix_all_encoding.js' || 
        e.name === 'fix_pontual.js' || 
        e.name === 'apply_fixes_exhaustive.js' ||
        e.name === 'apply_fixes.js' ||
        e.name === 'fix_deep.js'
      ) {
        continue;
      }
      processFile(fp);
    }
  }
}

console.log('Iniciando varredura e correções de encoding dinâmicas...');
walk(root);
console.log(`\nConcluído: ${updated} de ${total} arquivos corrigidos com sucesso.`);
