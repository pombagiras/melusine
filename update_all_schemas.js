const fs = require('fs');
const path = require('path');

const currentIsoDate = new Date().toISOString();

// 1. Core Schema Objects to standardize across the graph
const enrichAuthor = {
  "@type": "Person",
  "@id": "https://pombagiras.com/#author",
  "name": "Alexia Melusine",
  "alternateName": ["Alexia Rosa de Fogo", "Alexia Luz de Ferro"],
  "url": "https://pombagiras.com/alexiamelusine/",
  "jobTitle": ["Desenvolvedora Web", "Diretora de Vídeo IA", "Engenheira de Prompt"],
  "sameAs": [
    "https://www.wikidata.org/wiki/Q139714039",
    "https://github.com/pombagiras",
    "https://github.com/alexialuzdeferro",
    "https://github.com/Orgulho-Trans",
    "https://www.tiktok.com/@alexiamelusine",
    "https://www.tiktok.com/@alexia.melusine",
    "https://www.tiktok.com/@alexiarosadefogo?lang=pt-BR",
    "https://www.instagram.com/alexiamelusine/",
    "https://www.threads.net/@alexiamelusine",
    "https://www.kwai.com/@AlexiaRosadeFogo",
    "https://www.kwai.com/@alexialuzdeferro",
    "https://www.behance.net/alexiamelusine",
    "https://www.reddit.com/user/Alexia-Luz-de-Ferro/",
    "https://alexiamelusine.substack.com/",
    "https://substack.com/@alexiamelusine",
    "https://medium.com/@alexiamelusine",
    "https://mastodon.social/@alexiamelusine",
    "https://www.tumblr.com/alexiamelusine",
    "https://www.facebook.com/alexia.tsan.7",
    "https://www.meta.ai/@alexiamelusine",
    "https://www.imdb.com/pt/user/p.uynuqaimnns5lq5qxr2gtuaeky?ref_=ext_shr_lnk",
    "https://www.snapchat.com/@alexiamelusine",
    "https://linktr.ee/alexiarosadefogo"
  ],
  "knowsAbout": ["Pombagira", "Umbanda", "Quimbanda", "Candomblé", "Orixás", "Exu", "AI", "SEO Técnico"]
};

const organizationObj = {
  "@type": "Organization",
  "@id": "https://pombagiras.com/#organization",
  "name": "Pombagiras.com",
  "url": "https://pombagiras.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Favicon%20%20Miniatura%20do%20Google.png"
  },
  "sameAs": [
    "https://whatsapp.com/channel/0029VbBs2AnJkK7J9J0nLr2G",
    "https://t.me/pomba_giras",
    "https://discord.gg/gWZP8R7Dqu",
    "https://open.spotify.com/show/0oeCL1QScD3v7dHeUvJjgJ",
    "https://open.spotify.com/show/6ahRd7QT2wcq7ldt5CJHZW",
    "https://www.youtube.com/@almasdepombagira",
    "https://music.youtube.com/playlist?list=PLQt8e8mSPiZiri0foMoc4dHwINiDbQjB2",
    "https://www.instagram.com/almasdepombagira/",
    "https://www.tiktok.com/@almasdepombagira?lang=pt-BR",
    "https://www.tiktok.com/@espelhosdepombagira?lang=pt-BR",
    "https://www.tiktok.com/@pambunjila",
    "https://www.threads.net/@almasdepombagira",
    "https://www.kwai.com/@AlmasdePombagira",
    "https://www.kwai.com/@espelhosdepombagira",
    "https://www.kwai.com/@PambuNjila",
    "https://x.com/PambuNjila",
    "https://br.pinterest.com/almasdepombagira/",
    "https://br.pinterest.com/almasdepombagira/alexia-melusine-criatura-%C3%A9-criador/",
    "https://www.facebook.com/almasdepombagira/",
    "https://bsky.app/profile/almasdepombagira.bsky.social",
    "https://bio.site/AlmasdePombagira",
    "https://pombagiras.my.canva.site/"
  ]
};

const websiteObj = {
  "@type": "WebSite",
  "@id": "https://pombagiras.com/#website",
  "url": "https://pombagiras.com/",
  "name": "Pombagiras.com",
  "description": "A maior enciclopédia online sobre Pombagiras, Exus e tradições afro-brasileiras. +200 páginas de conteúdo sagrado.",
  "publisher": {
    "@id": "https://pombagiras.com/#organization"
  },
  "inLanguage": "pt-BR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://pombagiras.com/?s={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// 2. Helper Functions
function replaceJsonLd(htmlContent, newJsonObj) {
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    const match = htmlContent.match(jsonLdRegex);
    if (!match) return htmlContent;
    
    const prettyJson = JSON.stringify(newJsonObj, null, 2);
    // Indent JSON lines to look pristine in the HTML file
    const indentedJson = prettyJson.split('\n').map(line => '    ' + line).join('\n');
    const newScriptTag = `<script type="application/ld+json">\n${indentedJson}\n    </script>`;
    
    return htmlContent.replace(jsonLdRegex, newScriptTag);
}

function normalizeFileName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ – /g, "-")
        .replace(/ /g, "-");
}

function parsePortalFAQs(html) {
    const qRegex = /<span class="faq-question">([^<]+)<\/span>/;
    const aRegex = /<div class="faq-content"[^>]*>([\s\S]*?)<\/div>/;
    const cleanParaRegex = /<p>([\s\S]*?)<\/p>/;

    const mainEntity = [];
    const faqBlockRegex = /<div class="faq-accordion-wrapper">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;
    const faqBlockMatch = html.match(faqBlockRegex);
    if (!faqBlockMatch) {
        console.log("Could not find FAQ block in portal/index.html");
        return [];
    }

    const faqBlock = faqBlockMatch[1];
    const items = faqBlock.split('<div class="faq-item');
    items.shift(); // remove the prefix block
    items.forEach(item => {
        const qMatch = item.match(qRegex);
        const aBlockMatch = item.match(aRegex);
        if (qMatch && aBlockMatch) {
            const question = qMatch[1].replace(/^\d+\.\s*/, '').trim();
            const aMatch = aBlockMatch[1].match(cleanParaRegex);
            let answer = aBlockMatch[1].replace(/<[^>]+>/g, '').trim();
            if (aMatch) {
                answer = aMatch[1].replace(/<[^>]+>/g, '').trim();
            }
            answer = answer.replace(/\s+/g, ' ');
            mainEntity.push({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": answer
                }
            });
        }
    });
    return mainEntity;
}

// Entity Lists definitions
const portalEntities = [
  { name: "Maria Padilha", file: "maria-padilha.html" },
  { name: "Maria Mulambo", file: "maria-mulambo.html" },
  { name: "Maria Navalha", file: "maria-navalha.html" },
  { name: "Maria Quitéria", file: "maria-quitéria.html" },
  { name: "Maria Farrapo", file: "maria-farrapo.html" },
  { name: "Pombagira Cigana", file: "pombagira-cigana.html" },
  { name: "Pombagira Menina", file: "pombagira-menina.html" },
  { name: "Rosa Caveira", file: "rosa-caveira.html" },
  { name: "Sete Saias", file: "sete-saias.html" },
  { name: "Dama da Noite", file: "dama-da-noite.html" },
  { name: "Da Figueira", file: "da-figueira.html" },
  { name: "Da Praia", file: "da-praia.html" },
  { name: "Da Lua", file: "da-lua.html" },
  { name: "Da Serra", file: "da-serra.html" },
  { name: "Da Sombra", file: "da-sombra.html" },
  { name: "Das Águas Profundas", file: "das-águas-profundas.html" },
  { name: "Das Almas", file: "das-almas.html" },
  { name: "Das Trevas", file: "das-trevas.html" },
  { name: "Do Fogo", file: "do-fogo.html" },
  { name: "Sete Encruzilhadas", file: "sete-encruzilhadas.html" },
  { name: "Da Fenda", file: "da-fenda.html" },
  { name: "Da Calunga Profunda", file: "da-calunga-profunda.html" },
  { name: "Da Neblina", file: "da-neblina.html" },
  { name: "Das Correntes", file: "das-correntes.html" },
  { name: "São Cipriano", file: "sao-cipriano.html" },
  { name: "Quem Tem Pombagira", file: "caracteristicas.html" },
  { name: "Como Saber", file: "como-saber.html" },
  { name: "Sinais de Pombagira", file: "sinais-pombagira.html" },
  { name: "Sombra Feminina", file: "sombra-feminina.html" },
  { name: "Medo de Pombagira", file: "medo-pombagira.html" },
  { name: "As Quatro Faces", file: "quatro-faces.html" },
  { name: "Pombagiras na História", file: "pombagiras-na-historia.html" },
  { name: "Por Que Nunca Desaparecem", file: "por-que-nunca-desaparecem.html" },
  { name: "Dossiê Histórico-Antropológico", file: "dossie.html" },
  { name: "Bahuchara Mata", file: "bahuchara-mata.html" },
  { name: "Natureza Humana", file: "natureza-humana.html" }
];

const guardiasNames = [
  "Maria Padilha",
  "Maria Mulambo",
  "Maria Quitéria",
  "Rosa Caveira",
  "Dama da Noite",
  "Sete Saias",
  "Pombagira Cigana",
  "Maria Navalha",
  "Pombagira da Praia",
  "Maria Farrapo",
  "Pombagira Menina",
  "Pombagira da Figueira",
  "Pombagira das Almas",
  "Pombagira Sete Encruzilhadas",
  "Pombagira da Lua",
  "Pombagira das Trevas",
  "Pombagira da Serra",
  "Pombagira do Fogo",
  "Pombagira das Águas Profundas",
  "Pombagira da Sombra",
  "Pombagira da Fenda",
  "Pombagira da Calunga Profunda",
  "Pombagira das Correntes",
  "Pombagira da Neblina",
  "Pombagira da Estrada",
  "Pombagira do Vento",
  "Pombagira Cacurucaia – Senhora do Cruzeiro"
];

// 3. Execution Logic
function main() {
    console.log("Iniciando migração e atualização de dados estruturados em JSON-LD...");

    // === A. ATUALIZAR portal/index.html ===
    const portalIndexPath = path.join(__dirname, 'portal', 'index.html');
    if (fs.existsSync(portalIndexPath)) {
        let portalHtml = fs.readFileSync(portalIndexPath, 'utf8');
        const portalFaqs = parsePortalFAQs(portalHtml);
        const portalItems = portalEntities.map((ent, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": ent.name,
          "url": `https://pombagiras.com/portal/${ent.file}`
        }));
        
        const portalIndexGraph = {
          "@context": "https://schema.org",
          "@graph": [
            enrichAuthor,
            websiteObj,
            organizationObj,
            {
              "@type": "WebPage",
              "@id": "https://pombagiras.com/portal/#webpage",
              "url": "https://pombagiras.com/portal/",
              "name": "POMBAGIRAS.COM | Cultura, Arquétipos & Conhecimento",
              "description": "A maior plataforma de desmistificação das Pombagiras. Um mergulho profundo no conhecimento sagrado, história e arte, desconstruindo preconceitos com clareza e tecnologia.",
              "isPartOf": {
                "@id": "https://pombagiras.com/#website"
              },
              "about": {
                "@id": "https://pombagiras.com/#organization"
              },
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".speakable-title", ".speakable-description"]
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://pombagiras.com/portal/#primaryimage",
                "url": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Ogimage%20e%20Twitter%20Card.png",
                "width": 1200,
                "height": 630
              }
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://pombagiras.com/portal/#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://pombagiras.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Portal",
                  "item": "https://pombagiras.com/portal/"
                }
              ]
            },
            {
              "@type": "ItemList",
              "@id": "https://pombagiras.com/portal/#itemlist",
              "name": "Guardiãs - Portal Visceral",
              "description": `Artigos e correspondências sagradas de ${portalEntities.length} Pombagiras no Portal Visceral.`,
              "numberOfItems": portalEntities.length,
              "itemListElement": portalItems
            },
            {
              "@type": "FAQPage",
              "@id": "https://pombagiras.com/portal/#faq",
              "isPartOf": {
                "@id": "https://pombagiras.com/portal/#webpage"
              },
              "mainEntity": portalFaqs
            }
          ]
        };
        
        fs.writeFileSync(portalIndexPath, replaceJsonLd(portalHtml, portalIndexGraph), 'utf8');
        console.log("✔ portal/index.html atualizado com sucesso!");
    } else {
        console.warn("⚠ portal/index.html não foi encontrado.");
    }

    // === B. ATUALIZAR guardias/index.html ===
    const guardiasIndexPath = path.join(__dirname, 'guardias', 'index.html');
    if (fs.existsSync(guardiasIndexPath)) {
        let guardiasHtml = fs.readFileSync(guardiasIndexPath, 'utf8');
        const guardiasItems = guardiasNames.map((name, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": name,
          "url": `https://pombagiras.com/guardias/${normalizeFileName(name)}.html`
        }));
        
        const guardiasIndexGraph = {
          "@context": "https://schema.org",
          "@graph": [
            enrichAuthor,
            websiteObj,
            organizationObj,
            {
              "@type": "WebPage",
              "@id": "https://pombagiras.com/guardias/#webpage",
              "url": "https://pombagiras.com/guardias/",
              "name": "POMBAGIRAS.COM | Cultura, Arquétipos & Conhecimento",
              "description": "A maior plataforma de desmistificação das Pombagiras. Um mergulho profundo no conhecimento sagrado, história e arte, desconstruindo preconceitos com clareza e tecnologia.",
              "isPartOf": {
                "@id": "https://pombagiras.com/#website"
              },
              "about": {
                "@id": "https://pombagiras.com/#organization"
              },
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".speakable-title", ".speakable-description"]
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://pombagiras.com/guardias/#primaryimage",
                "url": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Ogimage%20e%20Twitter%20Card.png",
                "width": 1200,
                "height": 630
              }
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://pombagiras.com/guardias/#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://pombagiras.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Guardiãs",
                  "item": "https://pombagiras.com/guardias/"
                }
              ]
            },
            {
              "@type": "Article",
              "@id": "https://pombagiras.com/guardias/#article",
              "isPartOf": {
                "@id": "https://pombagiras.com/guardias/#webpage"
              },
              "headline": "A Origem Histórica das Pombagiras",
              "description": "Exploração histórica, teológica e cultural sobre as origens e a evolução do culto às Pombagiras nas religiões afro-brasileiras.",
              "image": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Ogimage%20e%20Twitter%20Card.png",
              "author": {
                "@id": "https://pombagiras.com/#author"
              },
              "publisher": {
                "@id": "https://pombagiras.com/#organization"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://pombagiras.com/guardias/#webpage"
              },
              "inLanguage": "pt-BR",
              "datePublished": "2026-06-03T14:00:00-03:00",
              "dateModified": currentIsoDate
            },
            {
              "@type": "ItemList",
              "@id": "https://pombagiras.com/guardias/#itemlist",
              "name": "Guardiãs - Pombagiras",
              "description": "Enciclopédia ilustrada e teológica com 27 Guardiãs da Umbanda e Quimbanda.",
              "numberOfItems": 27,
              "itemListElement": guardiasItems
            }
          ]
        };
        
        fs.writeFileSync(guardiasIndexPath, replaceJsonLd(guardiasHtml, guardiasIndexGraph), 'utf8');
        console.log("✔ guardias/index.html atualizado com sucesso!");
    } else {
        console.warn("⚠ guardias/index.html não foi encontrado.");
    }

    // === C. ATUALIZAR AS PÁGINAS ESTÁTICAS DE portal/ (PT, EN, ES) ===
    const dirsToProcess = [
        { dir: path.join(__dirname, 'portal'), lang: 'pt' },
        { dir: path.join(__dirname, 'en', 'portal'), lang: 'en' },
        { dir: path.join(__dirname, 'es', 'portal'), lang: 'es' }
    ];

    dirsToProcess.forEach(({ dir, lang }) => {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            let count = 0;
            
            files.forEach(file => {
                if (path.extname(file).toLowerCase() === '.html' && file !== 'index.html' && file !== 'whatsapp.html') {
                    const filePath = path.join(dir, file);
                    const html = fs.readFileSync(filePath, 'utf8');
                    
                    // Process the subpage and replace ProfilePage with Article, enriching Person etc.
                    const updatedHtml = processPortalSubpage(file, html, lang);
                    if (updatedHtml) {
                        fs.writeFileSync(filePath, updatedHtml, 'utf8');
                        console.log(`  ✔ Subpágina atualizada: ${path.relative(__dirname, filePath)}`);
                        count++;
                    }
                }
            });
            console.log(`✔ Processadas ${count} subpáginas sob ${path.relative(__dirname, dir)}/ com sucesso!`);
        } else {
            console.warn(`⚠ Diretório ${path.relative(__dirname, dir)}/ não foi encontrado.`);
        }
    });

    // === D. ATUALIZAR ENTIDADES EM OUTRAS PÁGINAS ESTÁTICAS E HUBS ===
    console.log("Atualizando dados estruturados nos hubs estáticos...");
    const staticFiles = [
        path.join(__dirname, 'index.html'),
        path.join(__dirname, 'privacy.html'),
        path.join(__dirname, 'terms.html'),
        path.join(__dirname, 'alexiamelusine', 'index.html'),
        path.join(__dirname, 'github', 'index.html'),
        path.join(__dirname, 'lebaras', 'index.html'),
        path.join(__dirname, 'vortex', 'index.html'),
        path.join(__dirname, 'en', 'index.html'),
        path.join(__dirname, 'es', 'index.html'),
        path.join(__dirname, 'en', 'portal', 'index.html'),
        path.join(__dirname, 'es', 'portal', 'index.html')
    ];
    staticFiles.forEach(filePath => {
        updateGraphEntities(filePath);
    });
}

function processPortalSubpage(fileName, html, lang = "pt") {
    const langPrefix = lang === "pt" ? "" : `${lang}/`;
    const inLanguage = lang === "pt" ? "pt-BR" : lang;

    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    const match = html.match(jsonLdRegex);
    if (!match) {
        console.warn(`    ⚠ Nenhum script JSON-LD encontrado em ${fileName} (${lang})`);
        return null;
    }
    
    let oldGraph;
    try {
        const parsed = JSON.parse(match[1]);
        oldGraph = parsed["@graph"] || [];
    } catch (e) {
        console.error(`    ❌ Erro ao analisar JSON-LD em ${fileName} (${lang}):`, e.message);
        return null;
    }
    
    // Extrai o nome e descrição do ProfilePage original
    let entityName = "";
    let entityDesc = "";
    const profilePageObj = oldGraph.find(obj => obj["@type"] === "ProfilePage");
    if (profilePageObj) {
        entityName = profilePageObj.name;
        entityDesc = profilePageObj.description;
    } else {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
            entityName = titleMatch[1].split('|')[0].trim();
        }
        const descMatch = html.match(/<meta name="description" content="([^"]+)">/i);
        if (descMatch) {
            entityDesc = descMatch[1].trim();
        }
    }
    
    // Extrai os FAQs do FAQPage original
    let faqMainEntity = [];
    const faqPageObj = oldGraph.find(obj => obj["@type"] === "FAQPage");
    if (faqPageObj && faqPageObj.mainEntity) {
        faqMainEntity = faqPageObj.mainEntity;
    }
    
    // Extrai o og:image
    let imageUrl = "";
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)">/i);
    if (ogImageMatch) {
        imageUrl = ogImageMatch[1].trim();
    }
    
    let headline = `Estudo e Fundamentos sobre a Guardiã ${entityName}`;
    let description = entityDesc || `Estudo aprofundado sobre os mistérios, regência e correspondências da Guardiã ${entityName}.`;
    
    if (lang === "en") {
        headline = `Study and Foundations of the Guardian ${entityName}`;
        if (!entityDesc) {
            description = `Deep study of the mysteries, regency, and correspondences of the Guardian ${entityName}.`;
        }
    } else if (lang === "es") {
        headline = `Estudio y Fundamentos sobre la Guardiana ${entityName}`;
        if (!entityDesc) {
            description = `Estudio profundo sobre los misterios, regencia y correspondencias de la Guardiana ${entityName}.`;
        }
    }

    // Reconstrói o JSON-LD como um Unified Knowledge Graph Schema
    const newGraph = {
      "@context": "https://schema.org",
      "@graph": [
        enrichAuthor,
        websiteObj,
        organizationObj,
        {
          "@type": "WebPage",
          "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#webpage`,
          "url": `https://pombagiras.com/${langPrefix}portal/${fileName}`,
          "name": `${entityName} | POMBAGIRAS.COM`,
          "isPartOf": {
            "@id": "https://pombagiras.com/#website"
          },
          "breadcrumb": {
            "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#breadcrumb`
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".speakable-title", ".speakable-description"]
          },
          "inLanguage": inLanguage
        },
        {
          "@type": "BreadcrumbList",
          "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": lang === "es" ? "Inicio" : "Home",
              "item": `https://pombagiras.com/${langPrefix}`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Portal",
              "item": `https://pombagiras.com/${langPrefix}portal/`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": entityName,
              "item": `https://pombagiras.com/${langPrefix}portal/${fileName}`
            }
          ]
        },
        {
          "@type": "Article",
          "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#article`,
          "isPartOf": {
            "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#webpage`
          },
          "headline": headline,
          "description": description,
          "image": imageUrl,
          "author": {
            "@id": "https://pombagiras.com/#author"
          },
          "publisher": {
            "@id": "https://pombagiras.com/#organization"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#webpage`
          },
          "inLanguage": inLanguage,
          "datePublished": "2026-06-03T14:00:00-03:00",
          "dateModified": currentIsoDate
        }
      ]
    };
    
    if (faqMainEntity.length > 0) {
        newGraph["@graph"].push({
          "@type": "FAQPage",
          "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#faq`,
          "isPartOf": {
            "@id": `https://pombagiras.com/${langPrefix}portal/${fileName}#webpage`
          },
          "mainEntity": faqMainEntity
        });
    }
    
    let resultHtml = replaceJsonLd(html, newGraph);
    
    // Inject LCP image preload right after <head> if not already present
    if (imageUrl && !resultHtml.includes('rel="preload"')) {
        resultHtml = resultHtml.replace('<head>', `<head>\n    <!-- Preload critical LCP image immediately -->\n    <link rel="preload" href="${imageUrl}" as="image" fetchpriority="high">`);
    }

    // Inject canonical link if not already present
    if (!resultHtml.includes('rel="canonical"')) {
        resultHtml = resultHtml.replace('<head>', `<head>\n    <link rel="canonical" href="https://pombagiras.com/${langPrefix}portal/${fileName}">`);
    }

    // Inject speakable classes
    if (resultHtml.includes('<h1') && !resultHtml.includes('speakable-title')) {
        if (resultHtml.match(/<h1[^>]*?class="[^"]*?"/i)) {
            resultHtml = resultHtml.replace(/(<h1[^>]*?class=")([^"]*?)(")/i, '$1$2 speakable-title$3');
        } else {
            resultHtml = resultHtml.replace(/<h1([^>]*?)>/i, '<h1$1 class="speakable-title">');
        }
    }

    if (resultHtml.includes('class="subtitle"') && !resultHtml.includes('speakable-description')) {
        resultHtml = resultHtml.replace(/(class="subtitle)(")/i, '$1 speakable-description$2');
    }

    // Inject privacy and terms links to footer
    const footerLinks = lang === "pt" ? `
            <div style="margin-top: 10px; margin-bottom: 10px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <a href="../privacy.html" style="color: var(--muted-text); text-decoration: none;">Política de Privacidade</a>
                <span style="color: var(--muted-text); opacity: 0.3;">|</span>
                <a href="../terms.html" style="color: var(--muted-text); text-decoration: none;">Termos de Uso</a>
            </div>` : (lang === "en" ? `
            <div style="margin-top: 10px; margin-bottom: 10px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <a href="../privacy.html" style="color: var(--muted-text); text-decoration: none;">Privacy Policy</a>
                <span style="color: var(--muted-text); opacity: 0.3;">|</span>
                <a href="../terms.html" style="color: var(--muted-text); text-decoration: none;">Terms of Use</a>
            </div>` : `
            <div style="margin-top: 10px; margin-bottom: 10px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <a href="../privacy.html" style="color: var(--muted-text); text-decoration: none;">Política de Privacidad</a>
                <span style="color: var(--muted-text); opacity: 0.3;">|</span>
                <a href="../terms.html" style="color: var(--muted-text); text-decoration: none;">Términos de Uso</a>
            </div>`);
    if (!resultHtml.includes('href="../privacy.html"')) {
        resultHtml = resultHtml.replace('</footer>', `${footerLinks}\n        </footer>`);
    }
    
    return resultHtml;
}

function updateGraphEntities(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠ Arquivo não encontrado para atualizar entidades: ${filePath}`);
        return;
    }
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    const match = htmlContent.match(jsonLdRegex);
    if (!match) return;
    
    try {
        const parsed = JSON.parse(match[1]);
        if (parsed["@graph"]) {
            parsed["@graph"] = parsed["@graph"].map(item => {
                if (item["@type"] === "Person" && item["@id"] === "https://pombagiras.com/#author") {
                    return enrichAuthor;
                }
                if (item["@type"] === "Organization" && item["@id"] === "https://pombagiras.com/#organization") {
                    return organizationObj;
                }
                return item;
            });
            const updatedHtml = replaceJsonLd(htmlContent, parsed);
            fs.writeFileSync(filePath, updatedHtml, 'utf8');
            console.log(`✔ Arquivo ${path.relative(__dirname, filePath)} atualizado com novas entidades!`);
        }
    } catch (e) {
        console.error(`❌ Erro ao analisar JSON-LD em ${filePath}:`, e.message);
    }
}

main();
