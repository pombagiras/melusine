const fs = require('fs');
const path = require('path');
const http = require('https');

const rootDir = __dirname;
const cacheFile = path.join(rootDir, 'translation_cache.json');

// Load translation cache
let translationCache = {};
if (fs.existsSync(cacheFile)) {
    try {
        translationCache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        console.log(`Loaded ${Object.keys(translationCache).length} cached translations.`);
    } catch (e) {
        console.error('Error loading translation cache:', e.message);
    }
}

// Save translation cache
function saveCache() {
    try {
        fs.writeFileSync(cacheFile, JSON.stringify(translationCache, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving cache:', e.message);
    }
}

// Google Translate Free API Request
function translateText(text, targetLang) {
    const trimmed = text.trim();
    if (!trimmed) return Promise.resolve(text);
    if (/^[0-9\s\-\+\:\(\)\&\|\*\@\$\#\%\!\?]*$/.test(trimmed)) return Promise.resolve(text); // skip numeric/symbolic-only strings

    const cacheKey = `${targetLang}:${trimmed}`;
    if (translationCache[cacheKey]) {
        return Promise.resolve(translationCache[cacheKey]);
    }

    return new Promise((resolve, reject) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const translatedText = parsed[0].map(item => item[0]).join('');
                    translationCache[cacheKey] = translatedText;
                    resolve(translatedText);
                } catch (e) {
                    reject(new Error(`Failed to parse translation response: ${data}`));
                }
            });
        }).on('error', (err) => reject(err));
    });
}

// Helper: wait to avoid hitting rate limits
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Translate JSON-LD Graph
async function translateJsonLd(jsonObj, targetLang) {
    if (!jsonObj) return jsonObj;

    async function processNode(node) {
        if (typeof node !== 'object' || node === null) return;

        // Fields to translate
        const fieldsToTranslate = ['name', 'description', 'headline', 'text'];
        for (const field of fieldsToTranslate) {
            if (typeof node[field] === 'string' && node[field].trim()) {
                // Do not translate specific author/organization names
                if (field === 'name' && (node[field] === 'Alexia Melusine' || node[field] === 'Pombagiras.com' || node[field].includes('@ALMASDEPOMBAGIRA'))) {
                    continue;
                }
                try {
                    node[field] = await translateText(node[field], targetLang);
                } catch (e) {
                    console.warn(`Warning: Could not translate JSON-LD field "${field}": ${node[field]}`);
                }
            }
        }

        // Adjust Language tags
        if (node['inLanguage'] === 'pt-BR') {
            node['inLanguage'] = targetLang === 'en' ? 'en' : 'es';
        }

        // Adjust IDs & URLs to match language structure
        const langPrefix = targetLang === 'en' ? 'en/' : 'es/';
        const urlFields = ['@id', 'url', 'item'];
        for (const field of urlFields) {
            if (typeof node[field] === 'string' && node[field].startsWith('https://pombagiras.com/')) {
                // e.g. https://pombagiras.com/portal/index.html -> https://pombagiras.com/en/portal/index.html
                let subPath = node[field].substring('https://pombagiras.com/'.length);
                if (!subPath.startsWith('en/') && !subPath.startsWith('es/')) {
                    node[field] = `https://pombagiras.com/${langPrefix}${subPath}`;
                }
            }
        }

        // Process children
        for (const key of Object.keys(node)) {
            if (typeof node[key] === 'object') {
                await processNode(node[key]);
            }
        }
    }

    await processNode(jsonObj);
    return jsonObj;
}

// Main Page Translator Engine
async function translatePage(filePath, targetDir, targetLang) {
    console.log(`Translating: ${path.relative(rootDir, filePath)} to [${targetLang.toUpperCase()}]`);
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Language switcher adjustments
    html = html.replace('lang="pt-BR"', `lang="${targetLang}"`);

    // 2. Head translation
    // Title tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        const titleText = titleMatch[1];
        try {
            const translatedTitle = await translateText(titleText, targetLang);
            html = html.replace(titleMatch[0], `<title>${translatedTitle}</title>`);
        } catch (e) {
            console.error(`Title translation failed: ${e.message}`);
        }
    }

    // Meta descriptions and titles
    const metaRegex = /<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/gi;
    let match;
    const metaToReplace = [];
    while ((match = metaRegex.exec(html)) !== null) {
        const name = match[1].toLowerCase();
        const content = match[2];
        if (name.includes('description') || name.includes('title')) {
            metaToReplace.push({ full: match[0], name: match[1], content: content });
        }
    }

    for (const item of metaToReplace) {
        try {
            const translatedContent = await translateText(item.content, targetLang);
            const newMeta = item.full.replace(item.content, translatedContent);
            html = html.replace(item.full, newMeta);
        } catch (e) {
            console.error(`Meta description translation failed for content "${item.content}": ${e.message}`);
        }
    }

    // Adjust alternate/canonical link href tags in head
    // e.g. <link rel="canonical" href="https://pombagiras.com/portal/maria-padilha.html"> -> https://pombagiras.com/en/portal/maria-padilha.html
    const linkRegex = /<link\s+[^>]*?href="https:\/\/pombagiras\.com\/([^"]+)"/gi;
    let linkMatch;
    const linksToReplace = [];
    while ((linkMatch = linkRegex.exec(html)) !== null) {
        const subPath = linkMatch[1];
        if (!subPath.startsWith('en/') && !subPath.startsWith('es/')) {
            linksToReplace.push({ full: linkMatch[0], subPath: subPath });
        }
    }
    for (const item of linksToReplace) {
        const newUrl = `https://pombagiras.com/${targetLang}/${item.subPath}`;
        const newLink = item.full.replace(`https://pombagiras.com/${item.subPath}`, newUrl);
        html = html.replace(item.full, newLink);
    }

    // 3. JSON-LD Schema translation
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let jsonMatch;
    const schemasToReplace = [];
    while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
        schemasToReplace.push({ full: jsonMatch[0], content: jsonMatch[1] });
    }
    for (const item of schemasToReplace) {
        try {
            let jsonObj = JSON.parse(item.content);
            jsonObj = await translateJsonLd(jsonObj, targetLang);
            const prettyJson = JSON.stringify(jsonObj, null, 2);
            const indentedJson = prettyJson.split('\n').map(line => '    ' + line).join('\n');
            const newScriptTag = `<script type="application/ld+json">\n${indentedJson}\n    </script>`;
            html = html.replace(item.full, newScriptTag);
        } catch (e) {
            console.error(`JSON-LD translation failed: ${e.message}`);
        }
    }

    // 4. Translate Body content nodes
    // We want to translate text within tags like h1, h2, h3, p, li, td, class="spec-value", class="oracao-text", breadcrumb navigation, back button etc.
    // Instead of complex tag parsing, we will match specific selectors and extract their text, translate it, and replace.
    // Tags to extract:
    const bodySelectors = [
        { regex: /<h1[^>]*>([\s\S]*?)<\/h1>/gi, type: 'h1' },
        { regex: /<h2[^>]*>([\s\S]*?)<\/h2>/gi, type: 'h2' },
        { regex: /<h3[^>]*>([\s\S]*?)<\/h3>/gi, type: 'h3' },
        { regex: /<p[^>]*>([\s\S]*?)<\/p>/gi, type: 'p' },
        { regex: /<div class="spec-value">([\s\S]*?)<\/div>/gi, type: 'spec-value' },
        { regex: /<div class="spec-label">([\s\S]*?)<\/div>/gi, type: 'spec-label' },
        { regex: /<td class="label-cell">([\s\S]*?)<\/td>/gi, type: 'td-label' },
        { regex: /<td class="value-cell">([\s\S]*?)<\/td>/gi, type: 'td-value' },
        { regex: /<div class="oracao-text">([\s\S]*?)<\/div>/gi, type: 'oracao' },
        { regex: /<span class="copy-status">([^<]+)<\/span>/gi, type: 'copy-status' },
        { regex: /<strong>Ponto Cantado de Força:<\/strong>/gi, type: 'ponto-cantado-label' }
    ];

    // Some global static strings we translate manually to be clean & fast
    const staticTranslations = {
        en: [
            ['Linha de Trabalho', 'Line of Work'],
            ['Cores de Axé', 'Colors of Axé'],
            ['Dia da Semana', 'Day of the Week'],
            ['Horário Místico', 'Mystical Time'],
            ['Atributos e Elementos Sagrados', 'Sacred Attributes & Elements'],
            ['História e Mistérios', 'History & Mysteries'],
            ['Fundamentos e Campo de Atuação', 'Foundations & Field of Action'],
            ['Voltar ao Portal', 'Back to Portal'],
            ['Copiar e-mail', 'Copy Email'],
            ['Copiado!', 'Copied!'],
            ['(Copiar)', '(Copy)'],
            ['Política de Privacidade', 'Privacy Policy'],
            ['Termos de Uso', 'Terms of Use'],
            ['Idealizado com rigor teológico por', 'Idealized with theological rigor by'],
            ['Todos os direitos reservados.', 'All rights reserved.'],
            ['Home', 'Home'],
            ['Guardiãs', 'Guardians'],
            ['Oferenda', 'Offering'],
            ['Cores', 'Colors'],
            ['Velas', 'Candles'],
            ['Local de Força', 'Place of Strength'],
            ['Horário Ideal', 'Ideal Time'],
            ['Lua Ideal', 'Ideal Moon'],
            ['Regência / Afinação', 'Regency / Affinity'],
            ['Dia de Força', 'Day of Strength'],
            ['Ponto Cantado de Força:', 'Chanted Point of Strength:'],
            ['Oração e Consagração a', 'Prayer and Consecration to']
        ],
        es: [
            ['Linha de Trabalho', 'Línea de Trabajo'],
            ['Cores de Axé', 'Colores de Axé'],
            ['Dia da Semana', 'Día de la Semana'],
            ['Horário Místico', 'Horario Místico'],
            ['Atributos e Elementos Sagrados', 'Atributos y Elementos Sagrados'],
            ['História e Mistérios', 'Historia y Misterios'],
            ['Fundamentos e Campo de Atuação', 'Fundamentos y Campo de Actuación'],
            ['Voltar ao Portal', 'Volver al Portal'],
            ['Copiar e-mail', 'Copiar correo'],
            ['Copiado!', '¡Copiado!'],
            ['(Copiar)', '(Copiar)'],
            ['Política de Privacidade', 'Política de Privacidad'],
            ['Termos de Uso', 'Términos de Uso'],
            ['Idealizado com rigor teológico por', 'Idealizado con rigor teológico por'],
            ['Todos os direitos reservados.', 'Todos los derechos reservados.'],
            ['Home', 'Inicio'],
            ['Guardiãs', 'Guardianas'],
            ['Oferenda', 'Ofrenda'],
            ['Cores', 'Colores'],
            ['Velas', 'Velas'],
            ['Local de Força', 'Lugar de Fuerza'],
            ['Horário Ideal', 'Horario Ideal'],
            ['Lua Ideal', 'Luna Ideal'],
            ['Regência / Afinação', 'Regencia / Afinación'],
            ['Dia de Força', 'Día de Fuerza'],
            ['Ponto Cantado de Força:', 'Punto Cantado de Fuerza:'],
            ['Oração e Consagração a', 'Oración y Consagración a']
        ]
    };

    // Apply static replacements first
    for (const [ptText, targetText] of staticTranslations[targetLang]) {
        html = html.split(ptText).join(targetText);
    }

    // Now extract specific elements and translate them via API
    const matchesToTranslate = [];
    for (const sel of bodySelectors) {
        let selMatch;
        // reset regex lastIndex
        sel.regex.lastIndex = 0;
        while ((selMatch = sel.regex.exec(html)) !== null) {
            const innerText = selMatch[1].trim();
            if (innerText && !innerText.startsWith('<img') && !innerText.startsWith('<a')) {
                // Avoid translating if it's already translated or just html tags
                matchesToTranslate.push({ full: selMatch[0], inner: selMatch[1], type: sel.type });
            }
        }
    }

    for (const item of matchesToTranslate) {
        // Strip out some HTML markup from inner if translating block, but for most paragraphs,
        // we can translate the whole text node, keeping tags
        const textToTranslate = item.inner.replace(/<\/?[^>]+(>|$)/g, "").trim();
        if (textToTranslate.length < 3) continue; // skip tiny texts

        try {
            const translatedText = await translateText(item.inner, targetLang);
            // Replace inner content
            html = html.replace(item.full, item.full.replace(item.inner, translatedText));
        } catch (e) {
            console.error(`Body text translation failed: ${e.message}`);
        }
    }

    // Translate back button/arrow link logic in headers
    // e.g. href="index.html" in en/portal/ should link back appropriately
    // e.g. <a href="index.html" class="brand">POMBAGIRAS<span>.COM</span></a>
    // inside en/portal/maria-padilha.html should go to en/portal/index.html
    html = html.replace(/href="index\.html"/g, 'href="index.html"'); 
    html = html.replace(/href="index\.html#portal"/g, 'href="index.html#portal"'); 
    html = html.replace(/href="\.\.\/index\.html"/g, 'href="../index.html"');
    html = html.replace(/href="\.\.\/index\.html#pombagiras"/g, 'href="../index.html#pombagiras"');

    // Make sure we write the translated file
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFilePath = path.join(targetDir, path.basename(filePath));
    fs.writeFileSync(targetFilePath, html, 'utf8');
    console.log(`Saved: ${path.relative(rootDir, targetFilePath)}`);
}

// Translate an entire directory of files
async function translateDirectory(sourceDir, targetDir, targetLang) {
    if (!fs.existsSync(sourceDir)) return;
    const files = fs.readdirSync(sourceDir);
    for (const file of files) {
        if (path.extname(file).toLowerCase() === '.html' && file !== 'index.html' && file !== 'whatsapp.html') {
            const filePath = path.join(sourceDir, file);
            await translatePage(filePath, targetDir, targetLang);
            await wait(100); // 100ms delay to be gentle on Google Translate API
        }
    }
}

// Hub index files translations
async function translateHubIndex(filePath, targetFilePath, targetLang) {
    console.log(`Translating Hub Index: ${path.relative(rootDir, filePath)}`);
    let html = fs.readFileSync(filePath, 'utf8');

    // Language adjustments
    html = html.replace('lang="pt-BR"', `lang="${targetLang}"`);

    // We can use a set of static translations for headers, categories, subheaders in these index files
    // Let's add standard headers
    const indexStatic = {
        en: [
            ['As Guardiãs e Seus Mistérios', 'The Guardians and Their Mysteries'],
            ['Explore a rica variedade de guardiãs, divididas em linhas', 'Explore the rich variety of guardians, divided into lines'],
            ['Passe o mouse sobre os cards para vivenciar o mistério', 'Hover over the cards to experience the mystery'],
            ['Todos', 'All'],
            ['Tradições e Marias', 'Traditions and Marias'],
            ['Almas e Calunga', 'Almas and Calunga'],
            ['Encruzilhadas e Caminhos', 'Crossroads and Paths'],
            ['Elementos da Natureza', 'Elements of Nature'],
            ['Tradição & Feitiço', 'Tradition & Sorcery'],
            ['Transmutação', 'Transmutation'],
            ['Proteção Urbana', 'Urban Protection'],
            ['Justiça e Ordem', 'Justice and Order'],
            ['Desapego e Cura', 'Detachment and Healing'],
            ['Liberdade & Clarividência', 'Freedom & Clairvoyance'],
            ['Juventude & Foco', 'Youth & Focus'],
            ['Lei & Rigor', 'Law & Rigor'],
            ['Dinâmica dos Caminhos', 'Dynamics of the Paths'],
            ['Mistério Noturno', 'Night Mystery'],
            ['Ancestralidade Terrena', 'Earthly Ancestry'],
            ['Fluidez e Limpeza', 'Fluidity and Cleansing'],
            ['Magnetismo Celeste', 'Celestial Magnetism'],
            ['Elevação & Foco', 'Elevation & Focus'],
            ['Autoconhecimento', 'Self-knowledge'],
            ['Subconsciente', 'Subconscious'],
            ['Consolo & Passagem', 'Consolation & Passage'],
            ['Quebra de Amarras', 'Breaking of Chains'],
            ['Energia Primordial', 'Primordial Energy'],
            ['Senhora da Escolha', 'Lady of Choice'],
            ['Portais Minerais', 'Mineral Portals'],
            ['Eternidade & Silêncio', 'Eternity & Silence'],
            ['Ocultamento', 'Ocultation'],
            ['Libertação', 'Liberation'],
            ['Quem Tem Pombagira', 'Who Has Pombagira'],
            ['Como Saber', 'How to Know'],
            ['Sinais de Pombagira', 'Signs of Pombagira'],
            ['Sombra Feminina', 'Feminine Shadow'],
            ['Medo de Pombagira', 'Fear of Pombagira'],
            ['As Quatro Faces', 'The Four Faces'],
            ['Pombagiras na História', 'Pombagiras in History'],
            ['Por Que Nunca Desaparecem', 'Why They Never Disappear'],
            ['Dossiê Histórico-Antropológico: As Doze Pombagiras', 'Historical-Anthropological Dossier: The Twelve Pombagiras'],
            ['O Que as Pombagiras Sabem Sobre a Natureza Humana', 'What Pombagiras Know About Human Nature'],
            ['Desejo, rejeição, solidão, medo do fim e as máscaras do ego', 'Desire, rejection, solitude, fear of the end, and the ego\'s masks'],
            ['Ler Estudo Completo', 'Read Full Study'],
            ['Ler Dossiê Completo', 'Read Full Dossier'],
            ['Perguntas', 'Questions'],
            ['Livros', 'Books'],
            ['Guardiãs', 'Guardians'],
            ['Voltar ao Portal', 'Back to Portal'],
            ['Filosofia Ancestral & Tecnologia', 'Ancestral Philosophy & Technology'],
            ['Guardiãs dos Limiares', 'Guardians of the Thresholds']
        ],
        es: [
            ['As Guardiãs e Seus Mistérios', 'Las Guardianas y Sus Misterios'],
            ['Explore a rica variedade de guardiãs, divididas em linhas', 'Explore la rica variedad de guardianas, divididas en líneas'],
            ['Passe o mouse sobre os cards para vivenciar o mistério', 'Pase el mouse sobre las cartas para experimentar el misterio'],
            ['Todos', 'Todos'],
            ['Tradições e Marias', 'Tradiciones y Marías'],
            ['Almas e Calunga', 'Almas y Calunga'],
            ['Encruzilhadas e Caminhos', 'Encrucijadas y Caminos'],
            ['Elementos da Natureza', 'Elementos de la Naturaleza'],
            ['Tradição & Feitiço', 'Tradición y Hechizo'],
            ['Transmutação', 'Transmutación'],
            ['Proteção Urbana', 'Protección Urbana'],
            ['Justiça e Ordem', 'Justicia y Orden'],
            ['Desapego e Cura', 'Desapego y Curación'],
            ['Liberdade & Clarividência', 'Libertad y Clarividencia'],
            ['Juventude & Foco', 'Juventud y Enfoque'],
            ['Lei & Rigor', 'Ley y Rigor'],
            ['Dinâmica dos Caminhos', 'Dinámica de los Caminos'],
            ['Mistério Noturno', 'Misterio Nocturno'],
            ['Ancestralidade Terrena', 'Ancestralidad Terrenal'],
            ['Fluidez e Limpeza', 'Fluidez y Limpieza'],
            ['Magnetismo Celeste', 'Magnetismo Celeste'],
            ['Elevação & Foco', 'Elevación y Enfoque'],
            ['Autoconhecimento', 'Autoconocimiento'],
            ['Subconsciente', 'Subconsciente'],
            ['Consolo & Passagem', 'Consuelo y Pasaje'],
            ['Quebra de Amarras', 'Quiebra de Amarras'],
            ['Energia Primordial', 'Energía Primordial'],
            ['Senhora da Escolha', 'Señora de la Elección'],
            ['Portais Minerais', 'Portales Minerales'],
            ['Eternidade & Silêncio', 'Eternidad y Silencio'],
            ['Ocultamento', 'Ocultamiento'],
            ['Libertação', 'Liberación'],
            ['Quem Tem Pombagira', 'Quién Tiene Pombagira'],
            ['Como Saber', 'Cómo Saber'],
            ['Sinais de Pombagira', 'Señales de Pombagira'],
            ['Sombra Feminina', 'Sombra Femenina'],
            ['Medo de Pombagira', 'Miedo a la Pombagira'],
            ['As Quatro Faces', 'Las Cuatro Caras'],
            ['Pombagiras na História', 'Pombagiras en la Historia'],
            ['Por Que Nunca Desaparecem', 'Por Qué Nunca Desaparecen'],
            ['Dossiê Histórico-Antropológico: As Doze Pombagiras', 'Dossier Histórico-Antropológico: Las Doce Pombagiras'],
            ['O Que as Pombagiras Sabem Sobre a Natureza Humana', 'Lo Que las Pombagiras Saben Sobre la Naturaleza Humana'],
            ['Desejo, rejeição, solidão, medo do fim e as máscaras do ego', 'Deseo, rechazo, soledad, miedo al fin y las máscaras del ego'],
            ['Ler Estudo Completo', 'Leer Estudio Completo'],
            ['Ler Dossiê Completo', 'Leer Dossier Completo'],
            ['Perguntas', 'Preguntas'],
            ['Livros', 'Libros'],
            ['Guardiãs', 'Guardianas'],
            ['Voltar ao Portal', 'Volver al Portal'],
            ['Filosofia Ancestral & Tecnologia', 'Filosofía Ancestral y Tecnología'],
            ['Guardiãs dos Limiares', 'Guardianas de los Umbrales']
        ]
    };

    // Apply static replacements
    for (const [ptText, targetText] of indexStatic[targetLang]) {
        html = html.split(ptText).join(targetText);
    }

    // Replace the title tag and description
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        try {
            const transTitle = await translateText(titleMatch[1], targetLang);
            html = html.replace(titleMatch[0], `<title>${transTitle}</title>`);
        } catch (e) {}
    }
    const descMatch = html.match(/<meta name="description" content="([^"]+)">/i);
    if (descMatch) {
        try {
            const transDesc = await translateText(descMatch[1], targetLang);
            html = html.replace(descMatch[0], `<meta name="description" content="${transDesc}">`);
        } catch (e) {}
    }

    // JSON-LD translation for Hub Index
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let jsonMatch;
    const schemasToReplace = [];
    while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
        schemasToReplace.push({ full: jsonMatch[0], content: jsonMatch[1] });
    }
    for (const item of schemasToReplace) {
        try {
            let jsonObj = JSON.parse(item.content);
            jsonObj = await translateJsonLd(jsonObj, targetLang);
            const prettyJson = JSON.stringify(jsonObj, null, 2);
            const indentedJson = prettyJson.split('\n').map(line => '    ' + line).join('\n');
            const newScriptTag = `<script type="application/ld+json">\n${indentedJson}\n    </script>`;
            html = html.replace(item.full, newScriptTag);
        } catch (e) {
            console.error(`JSON-LD Hub Index translation failed: ${e.message}`);
        }
    }

    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    fs.writeFileSync(targetFilePath, html, 'utf8');
    console.log(`Saved Hub Index: ${path.relative(rootDir, targetFilePath)}`);
}

async function run() {
    console.log("Starting full site translation pipeline...");

    // 1. Translate portal subpages to en/portal and es/portal
    console.log("== 1. Translating portal subpages ==");
    await translateDirectory(path.join(rootDir, 'portal'), path.join(rootDir, 'en', 'portal'), 'en');
    await translateDirectory(path.join(rootDir, 'portal'), path.join(rootDir, 'es', 'portal'), 'es');

    // 2. Translate guardias subpages to en/guardias and es/guardias
    console.log("== 2. Translating guardias subpages ==");
    await translateDirectory(path.join(rootDir, 'guardias'), path.join(rootDir, 'en', 'guardias'), 'en');
    await translateDirectory(path.join(rootDir, 'guardias'), path.join(rootDir, 'es', 'guardias'), 'es');

    // 3. Translate Hub Index files: guardias/index.html -> en/guardias/index.html & es/guardias/index.html
    console.log("== 3. Translating guardias index ==");
    await translateHubIndex(path.join(rootDir, 'guardias', 'index.html'), path.join(rootDir, 'en', 'guardias', 'index.html'), 'en');
    await translateHubIndex(path.join(rootDir, 'guardias', 'index.html'), path.join(rootDir, 'es', 'guardias', 'index.html'), 'es');

    // Save cache at the end
    saveCache();
    console.log("All batch translations completed successfully!");
}

run().catch(err => {
    console.error("FATAL ERROR IN TRANSLATION PIPELINE:", err);
    saveCache();
});
